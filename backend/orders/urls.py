from django.urls import path
from .views import CreateOrderView, OrderConfirmationView, OrderCreateAPIView

urlpatterns = [
    path('checkout/', CreateOrderView.as_view(), name='order_create'),
    path('confirmation/<int:pk>/', OrderConfirmationView.as_view(), name='order_confirmation'),
    path('api/create/', OrderCreateAPIView.as_view(), name='api_order_create'),
]
