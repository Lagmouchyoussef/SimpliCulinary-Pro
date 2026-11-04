from django.shortcuts import render, get_object_or_404
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, Category
from .data import products as static_products
from base.serializers import ProductSerializer

SORT_OPTIONS = {
    'newest': '-id',
    'price_asc': 'price',
    'price_desc': '-price',
    'name': 'name',
}


# Server-rendered shop page with category filter and sorting
class ProductListSimpleView(View):
    def get(self, request):
        current_category = request.GET.get('category', '')
        current_sort = request.GET.get('sort', 'newest')
        if current_sort not in SORT_OPTIONS:
            current_sort = 'newest'

        products = Product.objects.select_related('category')
        if current_category:
            products = products.filter(category__slug=current_category)
        products = products.order_by(SORT_OPTIONS[current_sort])

        return render(request, 'products/product_list.html', {
            'products': products,
            'categories': Category.objects.all(),
            'current_category': current_category,
            'current_sort': current_sort,
        })

# JSON API for the React storefront
class ProductList(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    def get(self, request, pk):
        product = get_object_or_404(Product, id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

class ProductDetailSimpleView(View):
    def get(self, request, pk):
        product = get_object_or_404(Product, id=pk)
        return render(request, 'products/product_detail.html', {'product': product})
