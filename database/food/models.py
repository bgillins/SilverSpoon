from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    opentable_link = models.URLField(blank=True)
    yelp_link = models.URLField(blank=True)
    google_reviews_link = models.URLField(blank=True)
    cuisine_type = models.CharField(max_length=100, blank=True)
    price_range = models.CharField(max_length=50, blank=True)
    available_times = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name
class Dish(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    restaurant = models.ForeignKey(Restaurant, related_name='dishes', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='dishes', on_delete=models.SET_NULL, null=True)
    dietary_flags = models.JSONField(default=dict)  # Example: {'vegan': True, 'gluten_free': False}
    spice_level = models.IntegerField(null=True)
    ingredients = models.TextField(blank=True)
    allergens = models.TextField(blank=True)
    photos = models.ManyToManyField('DishPhoto', related_name='dishes', blank=True)

    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"

class DishRanking(models.Model):
    user = models.ForeignKey('users.CustomUser', related_name='dish_rankings', on_delete=models.CASCADE)
    dish_name = models.CharField(max_length=255)  # e.g., "Pad Thai"
    restaurant = models.ForeignKey(Restaurant, related_name='dish_rankings', on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, related_name='rankings', on_delete=models.CASCADE)
    rank = models.PositiveIntegerField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'dish_name', 'restaurant']
        ordering = ['dish_name', 'rank']

    def __str__(self):
        return f"{self.user.username}'s rank {self.rank} for {self.dish_name} at {self.restaurant.name}"
    
class DishComparison(models.Model):
    user = models.ForeignKey('users.CustomUser', related_name='comparisons', on_delete=models.CASCADE)
    dish_a = models.ForeignKey(Dish, related_name='comparisons_as_a', on_delete=models.CASCADE)
    dish_b = models.ForeignKey(Dish, related_name='comparisons_as_b', on_delete=models.CASCADE)
    preferred_dish = models.ForeignKey(Dish, related_name='preferred_in_comparisons', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} prefers {self.preferred_dish.name}"
class Post(models.Model):
    user = models.ForeignKey('users.CustomUser', related_name='posts', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField('Tag', related_name='posts', blank=True)

    def __str__(self):
        return f"{self.user.username}'s post at {self.created_at}"

class Comment(models.Model):
    user = models.ForeignKey('users.CustomUser', related_name='comments', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField('Tag', related_name='comments', blank=True)

    def __str__(self):
        return f"Comment by {self.user.username}"

class Tag(models.Model):
    name = models.CharField(max_length=255, unique=True)
    dish = models.ForeignKey(Dish, related_name='tags', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey('users.CustomUser', related_name='tags', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"#{self.name}"

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class DishPhoto(models.Model):
    image = models.ImageField(upload_to='dish_photos/')
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.caption or f"Photo {self.id}"
