# users/models.py

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password, **extra_fields):
        if not email:
            raise ValueError("Email is required.")
        if not username:
            raise ValueError("Username is required.")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    # Profile Information
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    # Food Preferences
    disliked_ingredients = models.TextField(blank=True)  # Comma-separated list

    # Badges
    badges = models.ManyToManyField('Badge', blank=True)

    # Advertising Data
    consent_to_ads = models.BooleanField(default=True)
    preferences = models.JSONField(default=dict, blank=True)

    # Permissions
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class Badge(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='badges/', blank=True, null=True)

    def __str__(self):
        return self.name

class DietaryRestriction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='dietary_restrictions')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username}'s restriction: {self.name}"

class Cuisine(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='cuisines')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username}'s cuisine: {self.name}"
