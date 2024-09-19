from rest_framework import viewsets, permissions
from .models import CustomUser, Badge, DietaryRestriction, Cuisine
from .serializers import (
    CustomUserSerializer,
    CustomUserCreateSerializer,
    BadgeSerializer,
    DietaryRestrictionSerializer,
    CuisineSerializer,
    CustomTokenObtainPairSerializer,
    PasswordResetSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny 
from rest_framework.throttling import AnonRateThrottle

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return CustomUserCreateSerializer
        return CustomUserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_object(self):
        if self.action == 'me':
            return self.request.user
        return super().get_object()

    def update(self, request, *args, **kwargs):
        if kwargs.get('pk') == 'me':
            kwargs['pk'] = request.user.pk
        return super().update(request, *args, **kwargs)

class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]

class DietaryRestrictionViewSet(viewsets.ModelViewSet):
    queryset = DietaryRestriction.objects.all()
    serializer_class = DietaryRestrictionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CuisineViewSet(viewsets.ModelViewSet):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PasswordResetThrottle(AnonRateThrottle):
    scope = 'password_reset'

class PasswordResetView(APIView):
    throttle_classes = [PasswordResetThrottle]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)