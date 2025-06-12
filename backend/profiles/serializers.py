from rest_framework import serializers
from .models import CustomUser, UserImage, School

class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImage
        fields = ['id', 'image', 'uploaded_at', 'position']  # Include position for sorting

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'color']

class CustomUserSerializer(serializers.ModelSerializer):
    images = UserImageSerializer(many=True, read_only=True)  # Updated related_name
    school = SchoolSerializer(read_only=True)  # nested school
        #
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 'school',
            'pronoun', 'programe', 'location', 'about', 'details', 'interests',
            'profile_picture', 'images', 'bookmarks', 'swipes', 'matches'
        ]
