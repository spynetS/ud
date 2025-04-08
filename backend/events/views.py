from django.core.files.base import ContentFile
from django.utils.http import base64
from rest_framework import permissions
from rest_framework.fields import uuid
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.shortcuts import get_object_or_404, render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.
from rest_framework import generics, viewsets

from profiles.models import CustomUser

from .models import Event
from events.serializers import EventSerializer

# create so we can filter for school (creator's school)
# and whole sweden any school
class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        """
        Optionally filter events based on query parameters.
        - 'newest': Get the 5 newest events
        - 'popular': Get the 5 most popular events (most 'coming' users)
        """
        queryset = Event.objects.all()

        # Check for query parameters to filter the events
        filter_option = self.request.query_params.get('filter', None)

        if filter_option == 'newest':
            queryset = queryset.order_by('-date')[:5]  # Order by date descending (newest first) and limit to 5
        elif filter_option == 'popular':
            queryset = queryset.annotate(num_coming=Count('coming')).order_by('-num_coming')[:10]  # Count the 'coming' users and order by that (most popular) and limit to 5

        return queryset


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    event: Event = Event(
        title=request.data.get("title"),
        description=request.data.get("description"),
        location=request.data.get("location"),
        date=request.data.get("date"),
        creator=request.user
    )

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

    event.image.save(filename,image_file)
    event.save()

    return Response({"message":"new event added"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def can_create(request):
    amount_in_the_top_list = 10
    top_100 = CustomUser.objects.order_by('-swipes').all()[:amount_in_the_top_list]
    if request.user in top_100:
        return Response({"can":True})
    return Response({"can":False})



@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Requires token authentication
def comming(request):
    user = request.user
    event:Event = get_object_or_404(Event,pk=request.data.get('event'))
    if user in event.coming.all():
        event.coming.remove(user)
        event.save()
        return Response({"status":"removed user to event","added":False})
    else:
        event.coming.add(user)
        event.save()
        return Response({"status":"added user to event","added":True})
    return Response({"sucess":False})
