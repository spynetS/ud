from rest_framework import generics, permissions
from .models import CustomUser
from .serializers import CustomUserSerializer

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Requires token authentication
def get_user_data(request):
    user = request.user  # Get user from token
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "pronoun": user.pronoun,
        "location": user.location,
        "programe": user.programe,
        "school": user.school,
        "about": user.about,
        "details": user.details,
        "interests": user.interests,
        "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark(request):
    user = request.user  # Get user from token
    user_id = request.data.get('userId')  # Use request.data instead of request.POST
    user.bookmarks.add(CustomUser.objects.get(pk=user_id))
    user.save()
    print(user_id)
    return Response({"message": f"User {user_id} bookmarked!"}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unbookmark(request):
    user = request.user  # Get user from token
    user_id = request.data.get('userId')  # Use request.data instead of request.POST
    user.bookmarks.remove(CustomUser.objects.get(pk=user_id))
    user.save()
    print(user_id)
    return Response({"message": f"User {user_id} bookmarked!"}, status=200)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": user.username
        })
    else:
        return Response({"error": "Invalid credentials"}, status=400)



@api_view(['GET'])
#@permission_classes([IsAuthenticated])  # Requires token authentication
def get_swipes(request):
    users = CustomUser.objects.filter(is_superuser=False)  # Exclude superusers
    serializer = CustomUserSerializer(users, many=True)    # Serialize user data
    return Response(serializer.data)

class CustomUserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
