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
from base.authentication import SessionAuthenticationNoCSRF
from django.utils.decorators import method_decorator


class AddToCartView(View):
    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        try:
            quantity = max(int(request.POST.get('quantity', 1)), 1)
        except (TypeError, ValueError):
            quantity = 1

        cart = get_or_create_cart(request)
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        new_quantity = (cart_item.quantity if cart_item else 0) + quantity

        if new_quantity > product.stock:
            messages.error(request, f"Only {product.stock} unit(s) of {product.name} available.")
            return redirect('product_detail', pk=product_id)

        if cart_item is None:
            cart_item = CartItem(cart=cart, product=product)
        cart_item.quantity = new_quantity
        cart_item.save()

        if request.POST.get('buy_now'):
            return redirect('order_create')
        return redirect('cart_detail')


def add_to_cart_ajax(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, id=product_id)
        cart = get_or_create_cart(request)
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        new_quantity = 1 if created else cart_item.quantity + 1
        if new_quantity > product.stock:
            if created:
                cart_item.delete()
            return JsonResponse({
                "status": "error",
                "message": f"Only {product.stock} unit(s) of {product.name} available."
            }, status=400)
        cart_item.quantity = new_quantity
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
    # Only items of the visitor's own cart can be removed
    item = get_object_or_404(CartItem, id=pk, cart=get_or_create_cart(request))
    if request.method == 'POST':
        item.delete()
        return redirect('cart_detail')
    return render(request, 'cart/cartitem_delete.html', {'cartitem': item})

# API view to delete an item (React)
@method_decorator(csrf_exempt, name='dispatch')
class CartItemDeleteAPIView(APIView):
    authentication_classes = [SessionAuthenticationNoCSRF]
    permission_classes = []
    def delete(self, request, pk):
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, id=pk, cart=cart)
        item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CartItemUpdateView(View):
    def post(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart=get_or_create_cart(request))
        try:
            quantity = int(request.POST.get('quantity'))
        except (TypeError, ValueError):
            return redirect('cart_detail')

        if quantity < 1:
            cart_item.delete()
            return redirect('cart_detail')
        if quantity > cart_item.product.stock:
            messages.error(request, f"Only {cart_item.product.stock} unit(s) of {cart_item.product.name} available.")
            return redirect('cart_detail')

        cart_item.quantity = quantity
        cart_item.save()
        return redirect('cart_detail')


# API view for React
@method_decorator(csrf_exempt, name='dispatch')
class CartAPIView(APIView):
    authentication_classes = [SessionAuthenticationNoCSRF]  # session user, without CSRF enforcement
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
        
        existing = CartItem.objects.filter(cart=cart, product=product).first()
        new_quantity = (existing.quantity if existing else 0) + quantity
        if quantity < 1 or new_quantity > product.stock:
            return Response(
                {"error": f"Only {product.stock} unit(s) of {product.name} available."},
                status=400,
            )

        cart_item = existing or CartItem(cart=cart, product=product)
        cart_item.quantity = new_quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)
