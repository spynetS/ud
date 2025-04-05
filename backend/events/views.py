from django.db.models import Count
from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.decorators import api_view
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
