from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    PRONOUN_CHOICES = [
        ('she/her', 'She/Her'),
        ('he/him', 'He/Him'),
        # Add more pronoun choices as needed
    ]

    first_name = models.CharField(max_length=30, blank=True)  # Already exists in AbstractUser
    last_name = models.CharField(max_length=30, blank=True)   # Already exists in AbstractUser
    pronoun         = models.CharField(max_length=10, choices=PRONOUN_CHOICES, blank=True)
    location        = models.CharField(max_length=255, blank=True)
    programe        = models.CharField(max_length=50, blank=True)
    school          = models.CharField(max_length=255, blank=True)
    about           = models.TextField(blank=True)
    details         = models.JSONField(default=list, blank=True)  # Stores a list of details
    interests       = models.JSONField(default=list, blank=True)  # Stores a list of interests
    profile_picture = models.ImageField(upload_to='uploads/', blank=True, null=True)
    more_images     = models.ManyToManyField('UserImage', blank=True, related_name='users')

    bookmarks       = models.ManyToManyField('CustomUser',related_name='bookmarked_by',blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # Unique related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_permissions_set',  # Unique related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class UserImage(models.Model):
    image = models.ImageField(upload_to='user_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
