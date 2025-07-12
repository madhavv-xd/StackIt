# ai/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from ai.utils.rag import answer_with_rag
from main.models import Question, Answer
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1/",
)

@api_view(["POST"])
@permission_classes([AllowAny])
def rag_chatbot(request):
    question = request.data.get("question")
    if not question:
        return Response({"error": "No question provided"}, status=400)

    answer = answer_with_rag(question)
    clean_answer = answer.strip()  # ✨ remove leading/trailing newlines
    return Response({"answer": clean_answer})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ai_draft_answer(request):
    question_id = request.data.get("question_id")

    if not question_id:
        return Response({"error": "question_id is required"}, status=400)

    try:
        question = Question.objects.get(pk=question_id, is_active=True)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    prompt = f"""
You are a helpful developer answering questions on a technical Q&A platform.

Here is the user's question:
Title: {question.title}
Description: {question.description}

Write a clear, step-by-step, expert-level answer in Markdown format. If code is needed, include properly formatted code blocks.
"""

    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct:free",
            messages=[{"role": "user", "content": prompt}]
        )
        ai_answer = response.choices[0].message.content.strip()
        return Response({"answer": ai_answer})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
