from rest_framework import generics, permissions
from .models import CustomUser, UserImage, SCHOOL_COLORS
from .serializers import CustomUserSerializer, UserImageSerializer

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import TokenError


User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Requires token authentication
def get_user_data(request):
    user:CustomUser = request.user  # Get user from token

    matches = CustomUserSerializer(user.matches.filter(matches=user), many=True).data
    images = UserImageSerializer(user.images.all(), many=True).data

    bookmarks = []
    for b in user.bookmarks.all():
        bookmarks.append(b.pk)

    school_color = SCHOOL_COLORS.get(user.school, "#000000")  # fallback to black if no match

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "pronoun": user.pronoun,
        "location": user.location,
        "programe": user.programe,
        "school": user.school,
        "school_color": school_color,
        "about": user.about,
        "details": user.details,
        "bookmarks": bookmarks,
        "images" : images,
        "matches": matches,
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
    school_color = SCHOOL_COLORS.get(user.school, "#000000")  # fallback to black if no match

    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        expire_timestamp = access_token.payload["exp"]  # Correct way to access expiration

        return Response({
            "message": "Login successful",
            "access_token": str(access_token),
            "refresh_token": str(refresh),
            "expire": expire_timestamp,
            "user": user.username,
            "school_color":school_color,
        })
    else:
        return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def refresh_token(request):
    refresh_token = request.data.get('refresh_token')
    if not refresh_token:
        return Response({"error": "Refresh token is required"}, status=400)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return Response({
            "message": "Token refreshed successfully",
            "access_token": access_token
        })
    except TokenError:
        return Response({"error": "Invalid or expired refresh token"}, status=400)

class Top100UsersView(generics.ListAPIView):
    queryset = CustomUser.objects.order_by('-swipes')
    serializer_class = CustomUserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['pronoun','programe','location','school']  # Define filterable fields

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def swipe(request):
    swiped_user : CustomUser = CustomUser.objects.get(pk=request.data.get('id'))
    swiped_user.swipes = swiped_user.swipes+1
    swiped_user.save()


    user: CustomUser = request.user;
    user.matches.add(swiped_user)
    user.save()

    if user in swiped_user.matches.all():
        return Response({"match":True, "me":CustomUserSerializer(user).data,"other":CustomUserSerializer(swiped_user).data})

    return Response({"user":swiped_user.username})

class FriendListView(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile = self.request.user
        return profile.matches.all()

@api_view(['GET'])
def get_swipes(request):
    school_filter = request.GET.get('school', None)  # Get school parameter

    users = CustomUser.objects.filter(is_superuser=False)  # Exclude superusers

    if school_filter and school_filter.lower() != "all":
        users = users.filter(school=school_filter)  # Filter by school if not "all"

    serializer = CustomUserSerializer(users, many=True)  # Serialize user data
    return Response(serializer.data)

class CustomUserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

class CustomUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
