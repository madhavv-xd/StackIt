# ai/utils/rag.py
import faiss
import pickle
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# ✅ Load model + index
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("ai/faiss_data/answers.index")

with open("ai/faiss_data/answers_meta.pkl", "rb") as f:
    metadata = pickle.load(f)

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1/"
)

def get_relevant_context(query, k=4):
    vector = model.encode([query])
    _, indices = index.search(vector, k)
    return [metadata[i] for i in indices[0]]

def build_prompt(contexts, question):
    context_text = "\n\n".join(
        [f"Q: {c['question']}\nA: {c['content']}" for c in contexts]
    )
    return f"""
You are StackIt, an AI agent for a Q&A platform. For every question, you first search StackIt's existing answers for relevant information.

👉 If you find an answer in the context below, answer the user's question using ONLY that context.
👉 If the answer is NOT found in the context, honestly say: "StackIt does not have answers to this question yet. Here is an answer from the web:" and then provide your best response.

--- CONTEXT START ---
{context_text}
--- CONTEXT END ---

User's Question:
{question}

Your Answer:
"""


def answer_with_rag(question):
    contexts = get_relevant_context(question)
    prompt = build_prompt(contexts, question)

    response = client.chat.completions.create(
        model="mistralai/mistral-7b-instruct:free",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
