#!/usr/bin/env python3

from django.urls import path
from .views import *

urlpatterns = [
    path('users/', CustomUserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', CustomUserDetailView.as_view(), name='user-detail'),
    path('login/', login_user, name='login'),
    path('token/refresh',refresh_token,name='refresh_token'),
    path('user/', get_user_data, name='user_data'),
    path('get_swipes/', get_swipes, name='get_swipes'),
    path('bookmark/', bookmark, name='bookmark'),
    path('unbookmark/', unbookmark, name='unbookmark'),
    path('swipe/', swipe, name='swipe'),
    path('ranking/',Top100UsersView.as_view(),name='ranking'),

]
