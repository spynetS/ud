from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class School(models.Model):
    name = models.CharField(max_length=255, unique=True)
    color = models.CharField(max_length=7, default="#000000")  # Hex color, like "#810001"

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    PRONOUN_CHOICES = [
        ('she/her', 'She/Her'),
        ('he/him', 'He/Him'),
    ]

    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    pronoun = models.CharField(max_length=10, choices=PRONOUN_CHOICES, blank=True)
    location = models.CharField(max_length=255, blank=True)
    programe = models.CharField(max_length=50, blank=True)

    school = models.ForeignKey(
        'School',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )

    about = models.TextField(blank=True)
    details = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)

    profile_picture = models.ImageField(upload_to='uploads/', blank=True, null=True)

    matches = models.ManyToManyField('self', symmetrical=False, related_name='matches_of')

    swipes = models.BigIntegerField(default=0)
    bookmarks = models.ManyToManyField('CustomUser', related_name='bookmarked_by', blank=True)

    groups = models.ManyToManyField(Group, related_name='customuser_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_permissions_set', blank=True)

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

    @property
    def school_color(self):
        if self.school:
            return self.school.color
        return "#000000"

class UserImage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to='user_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    position = models.PositiveIntegerField(default=0)  # Field for sorting

    class Meta:
        ordering = ["position"]  # Ensures images are sorted by position
