from django.urls import path
from .views import SignupView, CustomLoginView, CustomLogoutView, LoginAPIView, SignupAPIView, SessionAPIView, LogoutAPIView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('api/login/', LoginAPIView.as_view(), name='api_login'),
    path('api/signup/', SignupAPIView.as_view(), name='api_signup'),
    path('api/logout/', LogoutAPIView.as_view(), name='api_logout'),
    path('api/session/', SessionAPIView.as_view(), name='api_session'),
]
