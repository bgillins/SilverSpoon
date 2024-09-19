from rest_framework import serializers
from .models import CustomUser, Badge, DietaryRestriction, Cuisine
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # Corrected line

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        user = CustomUser.objects.filter(email=email).first()
        if user and user.check_password(password):
            attrs['username'] = user.username
            return super().validate(attrs)
        else:
            raise serializers.ValidationError('No active account found with the given credentials')

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class DietaryRestrictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietaryRestriction
        fields = '__all__'

class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    badges = BadgeSerializer(many=True, read_only=True)
    dietary_restrictions = DietaryRestrictionSerializer(many=True, read_only=True)
    cuisines = CuisineSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        exclude = ('password',)

class CustomUserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
