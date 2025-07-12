from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, TagViewSet, AnswerViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'questions/(?P<question_id>\d+)/answers', AnswerViewSet, basename='answer')
router.register(r'questions/(?P<question_id>\d+)/comments', CommentViewSet, basename='question-comment')
router.register(r'questions/(?P<question_id>\d+)/answers/(?P<answer_id>\d+)/comments', CommentViewSet, basename='answer-comment')

urlpatterns = [
    path('', include(router.urls)),
]