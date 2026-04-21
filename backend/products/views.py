from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .data import products as static_products
from base.serializers import ProductSerializer

# Simple view (now uses MySQL database so add to cart works)
class ProductListSimpleView(View):
    def get(self, request):
        products = Product.objects.all()
        return render(request, 'products/product_list.html', {'products': products})

# API for React (maintains compatibility with frontend)
class ProductList(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    def get(self, request, pk):
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

class ProductDetailSimpleView(View):
    def get(self, request, pk):
        product = Product.objects.get(id=pk)
        return render(request, 'products/product_detail.html', {'product': product})
