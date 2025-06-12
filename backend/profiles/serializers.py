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
    matches = serializers.PrimaryKeyRelatedField(
            many=True,
            queryset=CustomUser.objects.all(),
            required=False,         # <-- don't require field
            allow_empty=True        # <-- allow an empty list
    )
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    school_id = serializers.PrimaryKeyRelatedField(
        queryset=School.objects.all(), source='school', write_only=True
    )

    extra_kwargs = {
        'password': {'write_only': True},
    }

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'password', 'first_name', 'last_name', 'email', 'school', 'school_id',
            'pronoun', 'programe', 'location', 'about', 'details', 'interests',
            'profile_picture', 'images', 'bookmarks', 'swipes', 'matches'
        ]
    def create(self, validated_data):
        bookmarks_data = validated_data.pop('bookmarks', [])
        password = validated_data.pop('password', None)
        matches_data = validated_data.pop('matches', [])

        user = CustomUser(**validated_data)

        if password:
            user.set_password(password)
        user.save()

        if matches_data:
            user.matches.set(matches_data)

        if bookmarks_data:
            user.bookmarks.set(bookmarks_data)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
