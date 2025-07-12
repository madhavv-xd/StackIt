# ai/urls.py
from django.urls import path
from .views import rag_chatbot, ai_draft_answer

urlpatterns = [
    path("chat/", rag_chatbot),
     path("draft-answer/", ai_draft_answer),
]
