from django.db import transaction
from django.utils import timezone

from products.models import Product
from . import payments
from .models import Order, OrderItem


class OrderError(Exception):
    """A user-facing problem while placing an order (empty cart, stock, payment...)."""


@transaction.atomic
def place_order(user, cart, shipping_address, payment_method, card=None, coin=None):
    """Create a paid order from the cart: check stock, take payment, decrement stock, empty the cart."""
    items = list(cart.items.select_related('product'))
    if not items:
        raise OrderError('Your cart is empty.')

    # Lock the products so concurrent orders cannot oversell
    products = {p.id: p for p in Product.objects.select_for_update().filter(id__in=[i.product_id for i in items])}
    total = 0
    for item in items:
        product = products[item.product_id]
        if item.quantity > product.stock:
            raise OrderError(f'Only {product.stock} unit(s) of {product.name} are left in stock.')
        total += product.price * item.quantity

    try:
        result = payments.process_payment(payment_method, total, card=card, coin=coin)
    except payments.PaymentError as exc:
        raise OrderError(str(exc)) from exc

    order = Order.objects.create(
        user=user,
        total=total,
        status='Paid',
        shipping_address=shipping_address,
        payment_method=payment_method,
        payment_details=result['details'],
        payment_reference=result['reference'],
        paid_at=timezone.now(),
    )
    for item in items:
        product = products[item.product_id]
        OrderItem.objects.create(order=order, product=product, quantity=item.quantity, price=product.price)
        product.stock -= item.quantity
        product.save(update_fields=['stock'])

    cart.items.all().delete()
    return order
