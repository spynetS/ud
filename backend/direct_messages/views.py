from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import Response

from profiles.models import CustomUser
from direct_messages.models import DirectMessage



# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    sender = get_object_or_404(CustomUser,pk=request.data.get("sender"))
    receiver = get_object_or_404(CustomUser,pk=request.data.get("receiver"))

    message_text = request.data.get("message")
    message = DirectMessage(sender=sender,receiver=receiver,message=message_text)

    message.save()

    return Response({"message":f"Message sent to {receiver}"})
