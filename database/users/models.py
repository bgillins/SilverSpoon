from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_influencer = models.BooleanField(default=False)
    social_media_links = models.JSONField(blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    email_preferences = models.JSONField(default=dict)
    communication_type = models.CharField(max_length=50, choices=[
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
    ], default='email')

    def __str__(self):
        return self.username
class UserFollow(models.Model):
    follower = models.ForeignKey('CustomUser', related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey('CustomUser', related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
