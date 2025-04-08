#!/usr/bin/env python3

from rest_framework import serializers
from .models import Event
from profiles.serializers import CustomUserSerializer
from profiles.models import CustomUser

from rest_framework import serializers
from .models import Event, CustomUser


class EventSerializer(serializers.ModelSerializer):
    coming = serializers.SlugRelatedField(slug_field='username', queryset=CustomUser.objects.all(), many=True, required=False, allow_null=True)
    creator = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    creator_details = CustomUserSerializer(source='creator', read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = ['id', 'date', 'title', 'location', 'description', 'creator_details', 'creator', 'coming', 'image']

    def validate_creator(self, value):
        # Optionally, restrict to current user
        request = self.context.get('request')
        if request and request.user != value:
            raise serializers.ValidationError("You can only create events for yourself.")
        return value
    def create(self, validated_data):
        coming_data = validated_data.pop('coming', [])  # Handle empty 'coming' list gracefully
        event = Event.objects.create(**validated_data)
        event.coming.set(coming_data)  # Set the users that are coming
        return event

    def update(self, instance, validated_data):
        coming_data = validated_data.pop('coming', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.coming.set(coming_data)  # Update the 'coming' field
        instance.save()
        return instance
