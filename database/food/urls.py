from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, DishViewSet, DishRankingViewSet, DishComparisonViewSet, PostViewSet, CommentViewSet, TagViewSet

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'dishes', DishViewSet)
router.register(r'dish-rankings', DishRankingViewSet)
router.register(r'dish-comparisons', DishComparisonViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = router.urls
