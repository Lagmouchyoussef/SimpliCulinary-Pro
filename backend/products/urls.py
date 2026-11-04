from django.urls import path
from .views import ProductList, ProductDetail, ProductListSimpleView, ProductDetailSimpleView

urlpatterns = [
    # Server-rendered storefront pages
    path('', ProductListSimpleView.as_view(), name='products_list'),
    path('<int:pk>/', ProductDetailSimpleView.as_view(), name='product_detail'),
    
    # JSON API consumed by the React storefront
    path('api/', ProductList.as_view(), name='api_products_list'),
    path('api/<int:pk>/', ProductDetail.as_view(), name='api_product_detail'),
]
