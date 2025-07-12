# ai/urls.py
from django.urls import path
from .views import rag_chatbot

urlpatterns = [
    path("chat/", rag_chatbot),
]
