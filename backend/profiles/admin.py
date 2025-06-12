from django.contrib import admin
from .models import CustomUser, UserImage, School
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(UserImage)

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ['name', 'color']
    search_fields = ['name']
