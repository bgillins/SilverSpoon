from django.contrib import admin
from .models import CustomUser, UserFollow

admin.site.register(CustomUser)
admin.site.register(UserFollow)
