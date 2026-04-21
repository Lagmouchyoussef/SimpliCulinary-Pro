from django.urls import path
from .views import CreateOrderView, OrderCreateAPIView

urlpatterns = [
    path('checkout/', CreateOrderView.as_view(), name='order_create'),
    path('api/create/', OrderCreateAPIView.as_view(), name='api_order_create'),
]
