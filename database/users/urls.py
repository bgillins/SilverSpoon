from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, UserFollowViewSet, RegisterView, LoginView
from django.urls import path

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
] + router.urls
