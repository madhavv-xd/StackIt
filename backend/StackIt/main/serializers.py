from rest_framework import serializers
from .models import Question, Tag, Answer, Comment, Vote, Notification
from django.contrib.auth.models import User

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
        read_only_fields = ['id']

    def validate_name(self, value):
        if self.instance is None and Tag.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Tag with this name already exists.")
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'vote_type']
        read_only_fields = ['id']

    def validate_vote_type(self, value):
        if value not in [1, -1]:
            raise serializers.ValidationError("Vote type must be 1 (upvote) or -1 (downvote).")
        return value

class AcceptAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'is_accepted']
        read_only_fields = ['id']

    def validate(self, data):
        answer = self.instance
        request = self.context['request']
        if answer.question.user != request.user:
            raise serializers.ValidationError("Only the question owner can accept an answer.")
        if not answer.is_active:
            raise serializers.ValidationError("Cannot accept an inactive answer.")
        return data

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'updated_at', 'is_active']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'is_active']

    def validate(self, data):
        question_id = self.context.get('question_id')
        answer_id = self.context.get('answer_id')
        if not (question_id or answer_id):
            raise serializers.ValidationError("A comment must be associated with either a question or an answer.")
        if question_id and answer_id:
            try:
                answer = Answer.objects.get(id=answer_id, question_id=question_id, is_active=True)
            except Answer.DoesNotExist:
                raise serializers.ValidationError("Answer does not exist or is not active for this question.")
        elif question_id:
            if not Question.objects.filter(id=question_id, is_active=True).exists():
                raise serializers.ValidationError("Question does not exist or is not active.")
        else:
            raise serializers.ValidationError("Must specify either question_id or both question_id and answer_id.")
        return data

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty.")
        return value

    def create(self, validated_data):
        question_id = self.context.get('question_id')
        answer_id = self.context.get('answer_id')
        user = self.context['request'].user
        if answer_id:
            answer = Answer.objects.get(id=answer_id, question_id=question_id)
            return Comment.objects.create(user=user, answer=answer, **validated_data)
        else:
            question = Question.objects.get(id=question_id)
            return Comment.objects.create(user=user, question=question, **validated_data)

class AnswerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Answer
        fields = ['id', 'user', 'content', 'created_at', 'updated_at', 'is_accepted', 'is_active', 'vote_score']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'is_accepted', 'is_active', 'vote_score']

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Answer content cannot be empty.")
        return value

class QuestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50), write_only=True
    )

    class Meta:
        model = Question
        fields = ['id', 'title', 'description', 'user', 'tags', 'tag_names', 'created_at', 'updated_at', 'is_active', 'num_answers', 'vote_score']
        read_only_fields = ['id', 'user', 'tags', 'created_at', 'updated_at', 'is_active', 'num_answers', 'vote_score']

    def validate_tag_names(self, value):
        for name in value:
            if not name.strip():
                raise serializers.ValidationError("Tag names cannot be empty.")
            if len(name) > 50:
                raise serializers.ValidationError("Tag name exceeds maximum length of 50 characters.")
        return value

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        question = Question.objects.create(**validated_data)
        tags = []
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(
                name__iexact=name,
                defaults={'name': name}
            )
            tags.append(tag)
        question.tags.set(tags)
        return question