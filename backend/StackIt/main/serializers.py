from rest_framework import serializers
from .models import Question, Tag, Answer, Comment, Vote, Notification
from StackIt.accounts.models import UserProfile as User

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class QuestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, source='tags'
    )
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'description', 'user', 'tags', 'tag_ids', 'created_at', 'updated_at', 'is_active', 'num_answers']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'is_active', 'num_answers']

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        user = self.context['request'].user
        question = Question.objects.create(user=user, **validated_data)
        question.tags.set(tags)
        return question