from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip', 'created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    guest_can_pause = serializers.BooleanField(required=True)
    votes_to_skip = serializers.IntegerField(required=True)

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')
