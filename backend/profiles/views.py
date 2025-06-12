import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import generics, permissions
from rest_framework.views import status
from .models import CustomUser, UserImage

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
    user = request.user

    matches = CustomUserSerializer(user.matches.filter(matches=user), many=True).data
    images = UserImageSerializer(user.images.all(), many=True).data
    bookmarks = [b.pk for b in user.bookmarks.all()]

    user_data = CustomUserSerializer(user).data

    # Add extra fields not in serializer
    user_data.update({
        'bookmarks': bookmarks,
        'images': images,
        'matches': matches,
    })

    # Fix profile_picture URL
    if user.profile_picture:
        user_data['profile_picture'] = request.build_absolute_uri(user.profile_picture.url)

    return Response(user_data)

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
        access_token = refresh.access_token
        expire_timestamp = access_token.payload["exp"]  # Correct way to access expiration

        return Response({
            "message": "Login successful",
            "access_token": str(access_token),
            "refresh_token": str(refresh),
            "expire": expire_timestamp,
            "user": user.username,
            "school_color":user.school.color,
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    user_data = request.data.get('user', {})  # Safely get the nested user dict

    serializer = CustomUserSerializer(user, data=user_data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Profile updated successfully'})
    else:
        return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_image_positions(request):
    user = request.user
    image_data = request.data.get("images", [])

    if not isinstance(image_data, list):
        return Response({"error": "Invalid data format."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Build a mapping of id -> position
        positions = {img["id"]: img["position"] for img in image_data if "id" in img and "position" in img}

        # Fetch only the user's images that match provided IDs
        user_images = UserImage.objects.filter(id__in=positions.keys(), user=user)

        # Update each image
        for image in user_images:
            new_position = positions.get(image.id)
            if new_position is not None:
                image.position = new_position
                image.save()

        return Response({"status": "Positions updated successfully."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_image(request):
    user = request.user  # request.user is already your logged-in user
    image_id = request.data.get("image")

    if not image_id:
        return Response({"detail": "No image ID provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        image = UserImage.objects.get(pk=image_id, user=user)
    except UserImage.DoesNotExist:
        return Response({"detail": "Image not found or does not belong to the user."}, status=status.HTTP_404_NOT_FOUND)

    image.delete()
    return Response({"detail": "Image deleted successfully."}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_image(request):
    img: UserImage = UserImage(user=request.user)

    base64_data = request.data.get("image")

    # Strip header if present
    if base64_data.startswith('data:image'):
        format, imgstr = base64_data.split(';base64,')  # format ~= data:image/png
        ext = format.split('/')[-1]  # "png"
    else:
        imgstr = base64_data
        ext = 'jpg'  # or default to png/jpg

    filename = f"event_images/{uuid.uuid4()}.{ext}"
    image_file = ContentFile(base64.b64decode(imgstr), name=filename)

    img.image.save(filename,image_file)
    img.save()
    return Response({"sucess":True})
