from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            payload = {'Bad Request': 'Invalid data', 'erros': serializer.errors}
            return Response(payload, status.HTTP_400_BAD_REQUEST)

        guest_can_pause = serializer.data['guest_can_pause']
        votes_to_skip = serializer.data['votes_to_skip']

        if not request.session.exists(request.session.session_key):
            request.session.create()
        host = request.session.session_key

        queryset = Room.objects.filter(host=host)
        if queryset.exists():
            room = queryset[0]
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status.HTTP_200_OK)
        else:
            room = Room(host=host, guest_can_pause=guest_can_pause,
                        votes_to_skip=votes_to_skip)
            room.save()

        return Response(RoomSerializer(room).data, status.HTTP_201_CREATED)
