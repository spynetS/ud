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
    path('matches/',FriendListView.as_view(),name='matches'),
    path('update/',update_profile,name="update"),
    path("add_image/",add_image,name="add_image"),
    path("edit_image_positions/",edit_image_positions,name="edit_image_positions"),

]
