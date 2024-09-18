from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        print("Login attempt with data:", request.data)  # Debugging statement
        response = super().post(request, *args, **kwargs)
        print("Login response:", response.data)  # Debugging statement
        return response
