from django.db import models
from django.dispatch import receiver

from profiles.models import CustomUser

# Create your models here.


class DirectMessage(models.Model):
    sender = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="sent_messages")
    receiver = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="received_messages")

    message = models.TextField()
