from django.urls import path
from .views import HomeView, NewsletterAPIView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('api/newsletter/', NewsletterAPIView.as_view(), name='api_newsletter'),
]
