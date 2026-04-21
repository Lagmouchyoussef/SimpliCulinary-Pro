from django.urls import path
from .views import ProductList, ProductDetail, ProductListSimpleView, ProductDetailSimpleView

urlpatterns = [
    # Page HTML simple demandée
    path('', ProductListSimpleView.as_view(), name='products_list'),
    path('<int:pk>/', ProductDetailSimpleView.as_view(), name='product_detail'),
    
    # API pour React
    path('api/', ProductList.as_view(), name='api_products_list'),
    path('api/<int:pk>/', ProductDetail.as_view(), name='api_product_detail'),
]
