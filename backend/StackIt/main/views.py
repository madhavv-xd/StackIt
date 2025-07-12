from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Question, Tag, Answer, Comment, Vote, Notification
from .serializers import QuestionSerializer, TagSerializer
from django.db.models import Q

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

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.filter(is_active=True)
    serializer_class = QuestionSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tags__id']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)