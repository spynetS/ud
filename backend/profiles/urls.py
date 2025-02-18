#!/usr/bin/env python3

from django.urls import path
from .views import CustomUserListCreateView, CustomUserDetailView

urlpatterns = [
    path('users/', CustomUserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', CustomUserDetailView.as_view(), name='user-detail'),
]
