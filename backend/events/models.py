from django.db import models
from profiles.models import CustomUser
# People with high rating (the people on the top list) can create events.
# date
# location
# description
# creator
# comming (users that comming)



class Event(models.Model):
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    title = models.TextField()
    description = models.TextField()
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    coming = models.ManyToManyField(CustomUser, related_name="coming_events")
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)

    def __str__(self):
        return f"Event on {self.date} at {self.location}"

