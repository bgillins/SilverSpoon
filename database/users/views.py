from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import CustomUser, UserFollow
from .serializers import CustomUserSerializer, UserFollowSerializer, RegisterSerializer

class CustomUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class UserFollowViewSet(viewsets.ModelViewSet):
    queryset = UserFollow.objects.all()
    serializer_class = UserFollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)

class RegisterView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)