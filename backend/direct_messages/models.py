from django.db import models
from django.dispatch import receiver
from rest_framework import serializers

from profiles.serializers import CustomUserSerializer
from profiles.models import CustomUser

# Create your models here.


class DirectMessage(models.Model):
    sender = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="sent_messages")
    receiver = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="received_messages")

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the message is created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when the message is updated

class DirectMessageSerializer(serializers.ModelSerializer):
    sender = CustomUserSerializer()
    receiver = CustomUserSerializer()
    class Meta:
        model = DirectMessage
        fields = [
            'sender','receiver','message','id','created_at','updated_at'
        ]
