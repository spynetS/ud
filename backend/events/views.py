from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.shortcuts import get_object_or_404, render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
from rest_framework import generics, viewsets

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
            queryset = queryset.annotate(num_coming=Count('coming')).order_by('-num_coming')[:5]  # Count the 'coming' users and order by that (most popular) and limit to 5

        return queryset


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

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
