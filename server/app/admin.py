from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django import forms
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse
from django.contrib.auth.models import Group

from app.constants import APP_NAME
from .models import HelpRequest

User = get_user_model()

# Custom forms to fix the password field issue
class CustomUserChangeForm(UserChangeForm):
    password = forms.CharField(
        label=_("Password"),
        required=False,
        widget=forms.PasswordInput,
        help_text=_("Raw passwords are not stored, so there is no way to see this "
                    "user's password, but you can change the password using "
                    "<a href=\"../password/\">this form</a>."),
    )

    class Meta:
        model = User
        fields = '__all__'

    def clean_password(self):
        # Return the initial value regardless of what was submitted
        return self.initial.get('password', '')


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'username')


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_active', 
                   'is_staff', 'date_joined', 'last_login', 'get_avatar_display')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone')
    ordering = ('-date_joined',)
    readonly_fields = ('date_joined', 'last_login')
    
    fieldsets = (
        (_('Login Information'), {
            'fields': ('email', 'username', 'password'),
        }),
        (_('Personal Information'), {
            'fields': ('first_name', 'last_name', 'phone', 'avatar'),
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Authentication'), {
            'fields': ('otp', 'otp_created_at'),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined'),
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_staff'),
        }),
    )
    
    def get_avatar_display(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="50" height="50" style="border-radius:50%; object-cover: cover;" />', obj.avatar)
        return format_html('<span style="color:gray;">No Avatar</span>')
    get_avatar_display.short_description = 'Avatar'
    
    actions = ['activate_users', 'deactivate_users', 'reset_otp', 'make_staff', 'remove_staff']
    
    # Override save_model to handle password correctly
    def save_model(self, request, obj, form, change):
        if change and not obj.password:
            # If this is a change and password is empty, keep the old password
            obj.password = User.objects.get(pk=obj.pk).password
        super().save_model(request, obj, form, change)
    
    @admin.action(description='Activate selected users')
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} user(s) have been activated.")
    
    @admin.action(description='Deactivate selected users')
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} user(s) have been deactivated.")
    
    @admin.action(description='Reset OTP for selected users')
    def reset_otp(self, request, queryset):
        for user in queryset:
            user.generate_otp()
        self.message_user(request, f"{queryset.count()} user(s) have had their OTP reset.")
    
    @admin.action(description='Grant staff privileges to selected users')
    def make_staff(self, request, queryset):
        queryset.update(is_staff=True)
        self.message_user(request, f"{queryset.count()} user(s) have been granted staff privileges.")
    
    @admin.action(description='Remove staff privileges from selected users')
    def remove_staff(self, request, queryset):
        queryset.update(is_staff=False)
        self.message_user(request, f"{queryset.count()} user(s) have had their staff privileges removed.")
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            qs = qs.filter(is_superuser=False)
        return qs
    
    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_superuser and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)
    
    def has_change_permission(self, request, obj=None):
        if obj and obj.is_superuser and not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj)

# Optional: Customize Group admin
admin.site.unregister(Group)
admin.site.site_header = APP_NAME

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_users_count')
    search_fields = ('name',)
    filter_horizontal = ('permissions',)
    
    def get_users_count(self, obj):
        return obj.user_set.count()
    get_users_count.short_description = 'Users'


@admin.register(HelpRequest)
class HelpRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'legal_issue_type', 'had_previous_help', 'created_at')
    list_filter = ('legal_issue_type', 'had_previous_help', 'created_at')
    search_fields = ('full_name', 'email', 'phone_number', 'description')
    readonly_fields = ('created_at', 'updated_at', 'id')
    
    fieldsets = (
        (None, {
            'fields': ('id', 'full_name', 'email', 'phone_number')
        }),
        ('Case Details', {
            'fields': ('legal_issue_type', 'had_previous_help', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    ordering = ('-created_at',)
