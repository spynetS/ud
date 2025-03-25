#!/usr/bin/env python3

from django.urls import path
from .views import *

urlpatterns = [
    path('send_message/', send_message, name='send_message'),

]
