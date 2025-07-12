# ai/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ai.utils.rag import answer_with_rag

@api_view(["POST"])
@permission_classes([AllowAny])
def rag_chatbot(request):
    question = request.data.get("question")
    if not question:
        return Response({"error": "No question provided"}, status=400)

    answer = answer_with_rag(question)
    clean_answer = answer.strip()  # ✨ remove leading/trailing newlines
    return Response({"answer": clean_answer})
