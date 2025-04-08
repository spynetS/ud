#!/usr/bin/env python3
from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
#router.register(r'events', EventViewSet)

urlpatterns = [
    path('get_events/', EventListView.as_view(), name='get_events'),

    path('events/comming/',comming),
    path('events/create/', create_event, name='event-create'),
    path('events/can_create/', can_create, name='event-create'),

]
