from rest_framework import serializers
from .models import CustomUser, UserImage

class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImage
        fields = ['id', 'image', 'uploaded_at']

class CustomUserSerializer(serializers.ModelSerializer):
    more_images = UserImageSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username','first_name','last_name', 'email', 'pronoun', 'programe', 'location',
            'about', 'details', 'interests', 'profile_picture', 'more_images', 'bookmarks', 'swipes'

]
