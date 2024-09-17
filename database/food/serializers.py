from rest_framework import serializers
from .models import Restaurant, Dish, DishRanking, DishComparison, Post, Comment, Tag
from users.serializers import CustomUserSerializer

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class DishSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True)

    class Meta:
        model = Dish
        fields = '__all__'

class DishRankingSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    dish = DishSerializer(read_only=True)

    class Meta:
        model = DishRanking
        fields = '__all__'

class DishComparisonSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    dish_a = DishSerializer()
    dish_b = DishSerializer()
    preferred_dish = DishSerializer()

    class Meta:
        model = DishComparison
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
