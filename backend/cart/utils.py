from django.db import transaction

from .models import Cart, CartItem


def _session_key(request):
    """Return the current session key, creating a session when needed."""
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def get_or_create_cart(request):
    """Return the cart of the logged-in user, or the guest cart bound to the session."""
    # DRF views with authentication_classes=[] expose an anonymous request.user,
    # so always read the user from the underlying Django request.
    http_request = getattr(request, '_request', request)
    user = http_request.user

    if user.is_authenticated:
        cart = Cart.objects.filter(user=user).order_by('id').first()
        if cart is None:
            cart = Cart.objects.create(user=user)
        return cart

    key = _session_key(http_request)
    cart = Cart.objects.filter(session_key=key, user__isnull=True).order_by('id').first()
    if cart is None:
        cart = Cart.objects.create(session_key=key)
    return cart


@transaction.atomic
def merge_guest_cart(session_key, user):
    """Move the items of the guest cart (identified by its old session key) into the user's cart.

    Call this right after authentication, passing the session key captured BEFORE login():
    Django rotates the session key on login, which would otherwise orphan the guest cart.
    """
    if not session_key:
        return
    guest_cart = Cart.objects.filter(session_key=session_key, user__isnull=True).first()
    if guest_cart is None:
        return

    user_cart = Cart.objects.filter(user=user).order_by('id').first()
    if user_cart is None:
        # Simply adopt the guest cart
        guest_cart.user = user
        guest_cart.session_key = None
        guest_cart.save(update_fields=['user', 'session_key'])
        return

    for item in guest_cart.items.select_related('product'):
        existing = CartItem.objects.filter(cart=user_cart, product=item.product).first()
        if existing:
            existing.quantity = min(existing.quantity + item.quantity, max(item.product.stock, 1))
            existing.save(update_fields=['quantity'])
        else:
            item.cart = user_cart
            item.quantity = min(item.quantity, max(item.product.stock, 1))
            item.save(update_fields=['cart', 'quantity'])
    guest_cart.delete()
