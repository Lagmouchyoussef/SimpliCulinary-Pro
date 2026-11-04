from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from base.authentication import SessionAuthenticationNoCSRF
from cart.utils import get_or_create_cart
from . import payments
from .forms import CheckoutForm
from .models import Order
from .serializers import OrderSerializer
from .services import OrderError, place_order


def _form_errors(form):
    """Flatten form errors into one readable message for the JSON API."""
    parts = []
    for field, errors in form.errors.items():
        parts.extend(errors)
    return ' '.join(parts) or 'Invalid data.'


@method_decorator(csrf_exempt, name='dispatch')
class OrderCreateAPIView(APIView):
    """Checkout for the React storefront. Requires a logged-in session."""
    authentication_classes = [SessionAuthenticationNoCSRF]
    permission_classes = []
    parser_classes = [JSONParser]  # JSON only: cross-site HTML forms cannot submit it

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Please log in or create an account to complete your purchase."},
                            status=status.HTTP_401_UNAUTHORIZED)

        form = CheckoutForm(request.data)
        if not form.is_valid():
            return Response({"error": _form_errors(form), "fields": form.errors},
                            status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        try:
            order = place_order(
                user, cart,
                shipping_address=form.cleaned_data['shipping_address'],
                payment_method=form.cleaned_data['payment_method'],
                card=form.card_data(),
                coin=form.cleaned_data.get('crypto_coin'),
            )
        except OrderError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class CreateOrderView(LoginRequiredMixin, View):
    """Checkout page: shipping address + payment. Guests are sent to log in / sign up first."""
    template_name = 'orders/shipping.html'

    def _render(self, request, form, cart, status_code=200):
        return render(request, self.template_name, {
            'form': form,
            'cart': cart,
            'methods': payments.PAYMENT_METHODS,
            'coins': payments.CRYPTO_COINS,
        }, status=status_code)

    def get(self, request):
        cart = get_or_create_cart(request)
        if not cart.items.exists():
            messages.info(request, 'Your cart is empty.')
            return redirect('cart_detail')
        form = CheckoutForm(initial={'shipping_address': request.user.address or '', 'payment_method': 'card'})
        return self._render(request, form, cart)

    def post(self, request):
        cart = get_or_create_cart(request)
        form = CheckoutForm(request.POST)
        if not form.is_valid():
            return self._render(request, form, cart, 400)

        try:
            order = place_order(
                request.user, cart,
                shipping_address=form.cleaned_data['shipping_address'],
                payment_method=form.cleaned_data['payment_method'],
                card=form.card_data(),
                coin=form.cleaned_data.get('crypto_coin'),
            )
        except OrderError as exc:
            messages.error(request, str(exc))
            return self._render(request, form, cart, 400)

        return redirect('order_confirmation', pk=order.pk)


class OrderConfirmationView(LoginRequiredMixin, View):
    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        return render(request, 'orders/confirmation.html', {'order': order})
