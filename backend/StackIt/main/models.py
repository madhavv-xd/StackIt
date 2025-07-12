from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinLengthValidator

# Replace with django-ckeditor's RichTextField if using a specific rich text editor
RichTextField = models.TextField  # Placeholder

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, validators=[MinLengthValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Question(models.Model):
    title = models.CharField(max_length=255, validators=[MinLengthValidator(5)])
    description = RichTextField()  # Use rich text editor in frontend
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    tags = models.ManyToManyField(Tag, related_name='questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # For admin moderation
    num_answers = models.PositiveIntegerField(default=0, editable=False)  # Track number of answers
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    content = RichTextField()  # Use rich text editor in frontend
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_accepted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)  # For admin moderation
    vote_score = models.IntegerField(default=0, editable=False)  # Net votes (upvotes - downvotes)
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        was_active = None
        if not is_new:
            was_active = Answer.objects.get(pk=self.pk).is_active
        
        super().save(*args, **kwargs)
        
        # Update num_answers
        if is_new and self.is_active:
            self.question.num_answers += 1
            self.question.save()
        elif not is_new and was_active != self.is_active:
            # Recalculate if is_active changed (e.g., admin moderation)
            self.question.num_answers = self.question.answers.filter(is_active=True).count()
            self.question.save()
    
    def delete(self, *args, **kwargs):
        if self.is_active:
            # Ensure num_answers doesn't go negative
            self.question.num_answers = max(0, self.question.answers.filter(is_active=True).count() - 1)
            self.question.save()
        super().delete(*args, **kwargs)
    
    class Meta:
        ordering = ['-is_accepted', '-created_at']
    
    def __str__(self):
        return f"Answer to {self.question.title} by {self.user.username}"

class Comment(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = RichTextField()  # Use rich text editor for comments
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # For admin moderation
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        target = self.question.title if self.question else f"Answer {self.answer.id}"
        return f"Comment on {target} by {self.user.username}"

class Vote(models.Model):
    VOTE_TYPES = (
        (1, 'Upvote'),
        (-1, 'Downvote'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='votes')
    vote_type = models.IntegerField(choices=VOTE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        was_vote_type = None
        if not is_new:
            was_vote_type = Vote.objects.get(pk=self.pk).vote_type
        
        super().save(*args, **kwargs)
        
        # Update vote_score
        if is_new:
            self.answer.vote_score += self.vote_type
            self.answer.save()
        elif was_vote_type != self.vote_type:
            # Adjust score if vote_type changes (e.g., upvote to downvote)
            self.answer.vote_score += (self.vote_type - was_vote_type)
            self.answer.save()
    
    def delete(self, *args, **kwargs):
        # Adjust vote_score on deletion
        self.answer.vote_score -= self.vote_type
        self.answer.save()
        super().delete(*args, **kwargs)
    
    class Meta:
        unique_together = ('user', 'answer')  # Prevent multiple votes from same user on same answer
    
    def __str__(self):
        return f"{self.user.username} {self.get_vote_type_display()} on Answer {self.answer.id}"

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('answer', 'New Answer'),
        ('comment', 'New Comment'),
        ('mention', 'Mention'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    content = models.TextField()  # e.g., "User X answered your question Y"
    related_question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    related_answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    related_comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.content}"