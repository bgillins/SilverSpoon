from rest_framework import serializers
from .models import CustomUser, UserFollow

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ('password',)

class UserFollowSerializer(serializers.ModelSerializer):
    follower = CustomUserSerializer(read_only=True)
    following = CustomUserSerializer(read_only=True)

    class Meta:
        model = UserFollow
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
