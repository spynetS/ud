from django.contrib import admin

# Register your models here.

from direct_messages.models import DirectMessage

admin.site.register(DirectMessage)
