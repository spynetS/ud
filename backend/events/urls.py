#!/usr/bin/env python3

from django.urls import path
from .views import *

urlpatterns = [
    path('get_events/', EventListView.as_view(), name='get_events'),


]
