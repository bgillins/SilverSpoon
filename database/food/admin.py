from django.contrib import admin
from .models import Restaurant, Dish, DishRanking, DishComparison, Post, Comment, Tag, Category, DishPhoto  # Updated from DishRating to DishRanking

admin.site.register(Restaurant)
admin.site.register(Dish)
admin.site.register(DishRanking)
admin.site.register(DishComparison)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Tag)
admin.site.register(Category)
admin.site.register(DishPhoto)
