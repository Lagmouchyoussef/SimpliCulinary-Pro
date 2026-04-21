from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Edit form
    fieldsets = UserAdmin.fieldsets + (
        ('Additional information', {'fields': ('phone', 'address')}),
    )
    # Add form
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional information', {'fields': ('email', 'phone', 'address')}),
    )
