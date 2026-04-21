from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.views.generic import DetailView, DeleteView
from django.urls import reverse_lazy
from django.contrib import messages
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CartSerializer
from .models import Cart, CartItem
from products.models import Product
from .utils import get_or_create_cart
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class AddToCartView(View):
    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        quantity = int(request.POST.get('quantity', 1))
        
        if quantity > product.stock:
            messages.error(request, f"Requested quantity ({quantity}) exceeds available stock ({product.stock}).")
            return redirect('product_detail', pk=product_id)
            
        cart = get_or_create_cart(request)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity
            
        cart_item.save()
        return redirect('cart_detail')

def add_to_cart_ajax(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, id=product_id)
        cart = get_or_create_cart(request)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += 1
        else:
            cart_item.quantity = 1
        cart_item.save()
        
        total_items = sum(item.quantity for item in cart.items.all())
        
        return JsonResponse({
            "status": "success",
            "total_items": total_items,
            "message": f"{product.name} added to cart!"
        })
    return JsonResponse({"status": "error"}, status=400)

class CartDetailView(DetailView):
    model = Cart
    template_name = 'cart/detail_cart.html'
    context_object_name = 'cart'

    def get_object(self):
        return get_or_create_cart(self.request)

def cart_item_delete(request, pk):
    item = get_object_or_404(CartItem, id=pk)
    item.delete()
    return redirect('cart_detail')

# API view to delete an item (React)
@method_decorator(csrf_exempt, name='dispatch')
class CartItemDeleteAPIView(APIView):
    authentication_classes = []
    permission_classes = []
    def delete(self, request, pk):
        item = get_object_or_404(CartItem, id=pk)
        item.delete()
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CartItemUpdateView(View):
    def post(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id)
        quantity = int(request.POST.get('quantity'))
        
        if quantity > cart_item.product.stock:
            messages.error(request, 'Quantity exceeds stock')
            return redirect('cart_detail')
            
        cart_item.quantity = quantity
        cart_item.save()
        return redirect('cart_detail')


# API view for React
@method_decorator(csrf_exempt, name='dispatch')
class CartAPIView(APIView):
    authentication_classes = [] # Disable default DRF authentication which forces CSRF
    permission_classes = []
    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = get_object_or_404(Product, id=product_id)
        cart = get_or_create_cart(request)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
