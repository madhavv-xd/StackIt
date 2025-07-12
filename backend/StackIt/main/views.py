from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Question, Tag, Answer, Comment, Vote, Notification
from .serializers import QuestionSerializer, TagSerializer, AnswerSerializer, VoteSerializer
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

    @action(detail=True, methods=['post', 'delete'], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        question = self.get_object()
        user = request.user

        if request.method == 'POST':
            serializer = VoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            vote_type = serializer.validated_data['vote_type']

            # Check if user already voted
            vote, created = Vote.objects.get_or_create(
                user=user, question=question,
                defaults={'vote_type': vote_type}
            )
            if not created and vote.vote_type != vote_type:
                # Update existing vote if vote_type changed
                vote.vote_type = vote_type
                vote.save()
            elif not created:
                raise PermissionDenied("You have already voted with this vote type.")
            return Response({'status': 'Vote recorded'}, status=201)

        elif request.method == 'DELETE':
            try:
                vote = Vote.objects.get(user=user, question=question)
                vote.delete()
                return Response({'status': 'Vote removed'}, status=204)
            except Vote.DoesNotExist:
                raise PermissionDenied("You have not voted on this question.")

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

    @action(detail=True, methods=['post', 'delete'], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None, question_id=None):
        answer = self.get_object()
        user = request.user

        if request.method == 'POST':
            serializer = VoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            vote_type = serializer.validated_data['vote_type']

            # Check if user already voted
            vote, created = Vote.objects.get_or_create(
                user=user, answer=answer,
                defaults={'vote_type': vote_type}
            )
            if not created and vote.vote_type != vote_type:
                # Update existing vote if vote_type changed
                vote.vote_type = vote_type
                vote.save()
            elif not created:
                raise PermissionDenied("You have already voted with this vote type.")
            return Response({'status': 'Vote recorded'}, status=201)

        elif request.method == 'DELETE':
            try:
                vote = Vote.objects.get(user=user, answer=answer)
                vote.delete()
                return Response({'status': 'Vote removed'}, status=204)
            except Vote.DoesNotExist:
                raise PermissionDenied("You have not voted on this answer.")