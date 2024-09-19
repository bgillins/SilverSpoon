from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, Badge, DietaryRestriction, Cuisine

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
        fields = '__all__'
        read_only_fields = ('email',)  # Prevent email from being edited if desired

class CustomUserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from .models import CustomUser

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        
        # Generate password reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Create password reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        
        # Send email
        subject = "Password Reset Request"
        message = f"Click the following link to reset your password: {reset_link}"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        
        send_mail(subject, message, from_email, recipient_list)
        
        return uid, token  # Return these for testing purposes