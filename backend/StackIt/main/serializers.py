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
        fields = ['id', 'title', 'description', 'user', 'tags', 'tag_names', 'created_at', 'updated_at', 'is_active', 'num_answers']
        read_only_fields = ['id', 'user', 'tags', 'created_at', 'updated_at', 'is_active', 'num_answers']

    def validate_tag_names(self, value):
        for name in value:
            if not name.strip():
                raise serializers.ValidationError("Tag names cannot be empty.")
            if len(name) > 50:
                raise serializers.ValidationError("Tag name exceeds maximum length of 50 characters.")
        return value

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        user = self.context['request'].user
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