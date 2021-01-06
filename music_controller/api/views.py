from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer


def create_session_if_not_exists(session):
    if not session.exists(session.session_key):
        session.create()


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get(self, request, *args, **kwargs):
        print(request.session.session_key)
        return self.list(request, *args, **kwargs)


class JoinRoomView(APIView):
    param_lookup = 'code'

    def post(self, request, format=None):
        code = request.data.get(self.param_lookup)

        create_session_if_not_exists(request.session)

        if code != None:
            room = Room.objects.filter(code=code)
            if room.exists():
                request.session['room_code'] = code
                return Response({"detail": "Room joined"}, status=status.HTTP_200_OK)
            return Response({"detail": "Room not exists"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST)


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
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            payload = {'Bad Request': 'Invalid data',
                       'erros': serializer.errors}
            return Response(payload, status.HTTP_400_BAD_REQUEST)

        guest_can_pause = serializer.data['guest_can_pause']
        votes_to_skip = serializer.data['votes_to_skip']

        create_session_if_not_exists(request.session)
        host = request.session.session_key

        queryset = Room.objects.filter(host=host)
        if queryset.exists():
            room = queryset[0]
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            request.session['room_code'] = room.code
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status.HTTP_200_OK)
        else:
            room = Room(host=host, guest_can_pause=guest_can_pause,
                        votes_to_skip=votes_to_skip)
            room.save()
            request.session['room_code'] = room.code

        return Response(RoomSerializer(room).data, status.HTTP_201_CREATED)


class UserInRoom(APIView):
    def get(self, request, format=None):

        create_session_if_not_exists(request.session)
        session_code = request.session.get('room_code')
        code = None
        if (Room.objects.filter(code=session_code).exists()):
            code = session_code
        payload = {
            'code': code
        }
        return Response(payload, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in request.session:
            request.session.pop('room_code')
            host_id = request.session.session_key
            queryset = Room.objects.filter(host=host_id)
            if queryset.exists():
                room = queryset[0]
                room.delete()

        return Response({'detail': 'You leave the room.'}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        create_session_if_not_exists(request.session)

        serializer = self.serializer_class(data=request.data)

        votes_to_skip = request.data.get('votes_to_skip')
        guest_can_pause = request.data.get('guest_can_pause')
        code = request.data.get('code')
        user_id = request.session.session_key

        """
        Validations
        """
        if not serializer.is_valid():
            return Response({'detail': serializer.errors})

        queryset = Room.objects.filter(code=code)
        if not queryset.exists():
            return Response({'detail': 'Room not exists'}, status=status.HTTP_404_NOT_FOUND)

        room = queryset[0]
        if room.host != user_id:
            return Response({'detail': 'Room not found'}, status=status.HTTP_403_FORBIDDEN)

        """
        Update data
        """
        room.votes_to_skip = votes_to_skip
        room.guest_can_pause = guest_can_pause
        room.save(update_fields=['votes_to_skip', 'guest_can_pause'])
        payload = {
            'detail': 'Data updated', 'data': {'room': RoomSerializer(room).data}
        }
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)
