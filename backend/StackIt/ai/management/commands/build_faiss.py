# ai/management/commands/build_faiss.py
from django.core.management.base import BaseCommand
from main.models import Answer
from sentence_transformers import SentenceTransformer
import faiss, pickle, os

class Command(BaseCommand):
    help = "Build FAISS index from answers"

    def handle(self, *args, **kwargs):
        model = SentenceTransformer("all-MiniLM-L6-v2")
        answers = Answer.objects.filter(is_active=True)

        texts = [a.content for a in answers]
        metadata = [{"id": a.id, "content": a.content, "question": a.question.title} for a in answers]
        vectors = model.encode(texts)

        index = faiss.IndexFlatL2(vectors[0].shape[0])
        index.add(vectors)

        os.makedirs("ai/faiss_data", exist_ok=True)
        faiss.write_index(index, "ai/faiss_data/answers.index")
        with open("ai/faiss_data/answers_meta.pkl", "wb") as f:
            pickle.dump(metadata, f)

        self.stdout.write(self.style.SUCCESS(f"Built FAISS index with {len(texts)} answers"))
