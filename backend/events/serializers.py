#!/usr/bin/env python3

from rest_framework import serializers
from .models import Event
from profiles.serializers import CustomUserSerializer
from profiles.models import CustomUser

class EventSerializer(serializers.ModelSerializer):
    # You can use `related_name` as 'coming' for the users attending the event
    coming = serializers.SlugRelatedField(slug_field='username', queryset=CustomUser.objects.all(), many=True)
    creator = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())  # Only expect the ID
    creator_details = CustomUserSerializer(source='creator', read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'date', 'title', 'location', 'description', 'creator_details','creator', 'coming', 'image']

    def create(self, validated_data):
        coming_data = validated_data.pop('coming')
        event = Event.objects.create(**validated_data)
        event.coming.set(coming_data)  # Assign the users that are coming
        return event

    def update(self, instance, validated_data):
        coming_data = validated_data.pop('coming', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if coming_data is not None:
            instance.coming.set(coming_data)
        instance.save()
        return instance
