from django.urls import path
from .views import (
    AddToCartView, CartDetailView, cart_item_delete, 
    CartItemUpdateView, CartAPIView, add_to_cart_ajax, CartItemDeleteAPIView
)

urlpatterns = [
    path('add/<int:product_id>/', AddToCartView.as_view(), name='add_cart'),
    path('add-ajax/<int:product_id>/', add_to_cart_ajax, name='add_cart_ajax'),
    path('', CartDetailView.as_view(), name='cart_detail'),
    path('api/', CartAPIView.as_view(), name='api_cart_detail'),
    path('api/item/<int:pk>/', CartItemDeleteAPIView.as_view(), name='api_cart_item_delete'),
    path('item/<int:pk>/delete/', cart_item_delete, name='cartItem_delete'),
    path('item/<int:item_id>/update/', CartItemUpdateView.as_view(), name='cartItem_update'),
]
