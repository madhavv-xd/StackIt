from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinLengthValidator

# Placeholder for rich text field (replace with django-ckeditor's RichTextField if used)
RichTextField = models.TextField

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, validators=[MinLengthValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Question(models.Model):
    title = models.CharField(max_length=255, validators=[MinLengthValidator(5)])
    description = RichTextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    tags = models.ManyToManyField(Tag, related_name='questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    num_answers = models.PositiveIntegerField(default=0, editable=False)
    vote_score = models.IntegerField(default=0, editable=False)  # Net votes (upvotes - downvotes)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    content = RichTextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_accepted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    vote_score = models.IntegerField(default=0, editable=False)
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        was_active = None
        if not is_new:
            was_active = Answer.objects.get(pk=self.pk).is_active
        
        super().save(*args, **kwargs)
        
        if is_new and self.is_active:
            self.question.num_answers += 1
            self.question.save()
        elif not is_new and was_active != self.is_active:
            self.question.num_answers = self.question.answers.filter(is_active=True).count()
            self.question.save()
    
    def delete(self, *args, **kwargs):
        if self.is_active:
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
    content = RichTextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
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
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='votes', null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='votes', null=True, blank=True)
    vote_type = models.IntegerField(choices=VOTE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        was_vote_type = None
        if not is_new:
            was_vote_type = Vote.objects.get(pk=self.pk).vote_type
        
        super().save(*args, **kwargs)
        
        # Update vote_score for question or answer
        target = self.question if self.question else self.answer
        if is_new:
            target.vote_score += self.vote_type
            target.save()
        elif was_vote_type != self.vote_type:
            target.vote_score += (self.vote_type - was_vote_type)
            target.save()
    
    def delete(self, *args, **kwargs):
        target = self.question if self.question else self.answer
        target.vote_score -= self.vote_type
        target.save()
        super().delete(*args, **kwargs)
    
    class Meta:
        unique_together = [
            ('user', 'question'),  # Prevent multiple votes on same question
            ('user', 'answer'),    # Prevent multiple votes on same answer
        ]
        constraints = [
            models.CheckConstraint(
                check=(models.Q(question__isnull=True, answer__isnull=False) |
                       models.Q(question__isnull=False, answer__isnull=True)),
                name='vote_one_target'
            )
        ]
    
    def __str__(self):
        target = self.question.title if self.question else f"Answer {self.answer.id}"
        return f"{self.user.username} {self.get_vote_type_display()} on {target}"

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('answer', 'New Answer'),
        ('comment', 'New Comment'),
        ('mention', 'Mention'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    content = models.TextField()
    related_question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    related_answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    related_comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.content}"