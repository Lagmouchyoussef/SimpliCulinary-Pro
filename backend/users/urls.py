from django.urls import path
from .views import SignupView, CustomLoginView, CustomLogoutView, LoginAPIView, SignupAPIView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('api/login/', LoginAPIView.as_view(), name='api_login'),
    path('api/signup/', SignupAPIView.as_view(), name='api_signup'),
]
