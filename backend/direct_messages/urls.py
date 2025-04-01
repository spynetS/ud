#!/usr/bin/env python3

from django.urls import path
from .views import *

urlpatterns = [
    path('send_message/', send_message, name='send_message'),
    path('get_messages',get_messages,name='get_messages'),

]
