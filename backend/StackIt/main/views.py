from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Question, Tag, Answer, Comment, Vote, Notification
from .serializers import QuestionSerializer, TagSerializer, AnswerSerializer
from django.db.models import Q
from rest_framework.exceptions import NotFound

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_staff

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (request.user == obj.user or request.user.is_staff)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.filter(is_active=True)
    serializer_class = QuestionSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tags__id']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, obj):
        obj.is_active = False
        obj.save()

class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]

    def get_queryset(self):
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id, is_active=True)

    def perform_create(self, serializer):
        try:
            question = Question.objects.get(id=self.kwargs['question_id'], is_active=True)
        except Question.DoesNotExist:
            raise NotFound("Question does not exist or is not active.")
        serializer.save(user=self.request.user, question=question)

    def perform_update(self, serializer):
        try:
            question = Question.objects.get(id=self.kwargs['question_id'], is_active=True)
        except Question.DoesNotExist:
            raise NotFound("Question does not exist or is not active.")
        serializer.save(question=question)
    
    def perform_destroy(self, obj):
        obj.is_active = False
        obj.save()
        # Recalculate the number of answers for the question
        obj.question.num_answers = obj.question.answers.filter(is_active=True).count()
        obj.question.save()