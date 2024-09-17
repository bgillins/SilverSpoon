from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, UserFollowViewSet, RegisterView
from django.urls import path

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'follows', UserFollowViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view({'post': 'create'}), name='register'),
] + router.urls
