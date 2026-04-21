from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import OrderForm
from .models import Order, OrderItem
from cart.utils import get_or_create_cart

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrderSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class OrderCreateAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        cart = get_or_create_cart(request)
        if not cart.items.exists():
            return Response({"error": "The cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        # For this workshop, we will use the first user if not logged in
        # or require a login. To simplify, we take the user from the session or the first user.
        user = request.user if request.user.is_authenticated else None
        
        if not user:
            from users.models import CustomUser
            user = CustomUser.objects.first() # Temporary solution for the workshop
            
        shipping_address = request.data.get('shipping_address', 'Default address (React Checkout)')
        
        order = Order.objects.create(
            user=user,
            total=0,
            shipping_address=shipping_address
        )
        
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        
        order.update_total()
        cart.items.all().delete()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CreateOrderView(LoginRequiredMixin, View):

    def get(self, request):
        cart = get_or_create_cart(request)
        form = OrderForm()
        return render(request, 'orders/shipping.html', {'form': form, 'cart': cart})

    def post(self, request):
        cart = get_or_create_cart(request)
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.total = 0 # Will be updated after adding items
            order.save()
            
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
            
            order.update_total()
            cart.items.all().delete()
            # Optionally delete the cart or keep it empty
            
            return render(request, 'orders/confirmation.html', {'order': order})
        
        return render(request, 'orders/shipping.html', {'form': form, 'cart': cart})
