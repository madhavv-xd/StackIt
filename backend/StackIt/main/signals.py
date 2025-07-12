# main/signals.py
import os, faiss, pickle
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from sentence_transformers import SentenceTransformer
from .models import Answer

INDEX_PATH   = "ai/faiss_data/answers.index"
META_PATH    = "ai/faiss_data/answers_meta.pkl"
EMB_MODEL_ID = "all-MiniLM-L6-v2"          # keep in sync with build_faiss.py

emb_model = SentenceTransformer(EMB_MODEL_ID)

def _load_index_and_meta():
    index  = faiss.read_index(INDEX_PATH)
    with open(META_PATH, "rb") as f:
        meta = pickle.load(f)
    return index, meta

def _save_index_and_meta(index, meta):
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "wb") as f:
        pickle.dump(meta, f)

@receiver(post_save, sender=Answer)
def add_or_update_answer(sender, instance, created, **kwargs):
    if not instance.is_active:          # ignore inactive edits
        return

    # Load
    index, meta = _load_index_and_meta()

    if created:
        vec = emb_model.encode([instance.content])
        index.add(vec)
        meta.append({
            "id": instance.id,
            "content": instance.content,
            "question": instance.question.title,
        })
    else:
        # For edits → rebuild vector in place
        try:
            idx = next(i for i, m in enumerate(meta) if m["id"] == instance.id)
        except StopIteration:
            return  # safety
        meta[idx]["content"] = instance.content
        meta[idx]["question"] = instance.question.title
        vec = emb_model.encode([instance.content])
        index.reconstruct(idx)          # ensure same dim
        index.replace_ids(faiss.IDSelector64(idx), vec)

    _save_index_and_meta(index, meta)
    print("✅ FAISS index updated for Answer", instance.id)

@receiver(post_delete, sender=Answer)
def remove_answer(sender, instance, **kwargs):
    index, meta = _load_index_and_meta()
    try:
        idx = next(i for i, m in enumerate(meta) if m["id"] == instance.id)
    except StopIteration:
        return
    index.remove_ids(faiss.IDSelector64(idx))
    meta.pop(idx)
    _save_index_and_meta(index, meta)
    print("🗑️  Removed Answer", instance.id, "from FAISS")
    