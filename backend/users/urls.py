from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomUserViewSet,
    BadgeViewSet,
    DietaryRestrictionViewSet,
    CuisineViewSet,
    CustomTokenObtainPairView,
    PasswordResetView,
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'badges', BadgeViewSet)
router.register(r'dietary-restrictions', DietaryRestrictionViewSet)
router.register(r'cuisines', CuisineViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('me/', CustomUserViewSet.as_view({'get': 'me'}), name='user_me'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
]
