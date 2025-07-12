# ai/utils/rag.py
import faiss
import pickle
import os
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

model = SentenceTransformer("all-MiniLM-L6-v2")
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1/"
)

# Load FAISS index & metadata
index = faiss.read_index("ai/faiss_data/answers.index")
with open("ai/faiss_data/answers_meta.pkl", "rb") as f:
    metadata = pickle.load(f)


def get_relevant_context(query, k=4, relevance_threshold=0.65):
    """Search FAISS and filter based on distance threshold."""
    query_vector = model.encode([query])
    D, I = index.search(query_vector, k)

    context = []
    for dist, idx in zip(D[0], I[0]):
        if idx == -1:
            continue  # no more matches
        similarity = 1 - dist  # L2 distance → cosine-like
        if similarity >= relevance_threshold:
            context.append(metadata[idx])
    return context


def build_prompt(contexts, question):
    if contexts:
        context_block = "\n\n".join([f"Q: {c['question']}\nA: {c['content']}" for c in contexts])
    else:
        context_block = "*no relevant data available*"

    return f"""
You are StackIt, an AI agent for a Q&A platform. For every question, you first search StackIt's existing answers for relevant information.

👉 If you find a relevant answer in the context below, answer the user's question using ONLY that context.

👉 If no helpful context is found, say:
"StackIt does not have answers to this question yet. Here is an answer from the web:"
...and then continue with your own general answer.

--- CONTEXT START ---
{context_block}
--- CONTEXT END ---

User's Question:
{question}

Your Answer:
"""


def answer_with_rag(question):
    context = get_relevant_context(question)
    prompt = build_prompt(context, question)

    response = client.chat.completions.create(
        model="mistralai/mistral-7b-instruct:free",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content.strip()
