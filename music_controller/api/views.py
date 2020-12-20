from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get(self, request, *args, **kwargs):
        print(request.session.session_key)
        return self.list(request, *args, **kwargs)


class GetRoomView(APIView):
    serializer_class = RoomSerializer
    param_to_search = 'code'

    def get(self, request, format=None):
        code = request.query_params.get(self.param_to_search)
        if len(code) > 0:
            room = Room.objects.filter(code=code)
            if room.exists():
                data = RoomSerializer(room[0]).data
                data['is_host'] = request.session.session_key == room[0].host
                return Response(data, status.HTTP_200_OK)
            return Response({"Room not found": "Invalid Room Code"}, status.HTTP_400_BAD_REQUEST)
        return Response({"Bad request": "Code parameter not found"}, status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        print(request.session.session_key)
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            payload = {'Bad Request': 'Invalid data',
                       'erros': serializer.errors}
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
