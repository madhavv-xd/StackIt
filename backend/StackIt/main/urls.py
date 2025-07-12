from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, TagViewSet, AnswerViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'questions/(?P<question_id>\d+)/answers', AnswerViewSet, basename='answer')

urlpatterns = [
    path('', include(router.urls)),
]