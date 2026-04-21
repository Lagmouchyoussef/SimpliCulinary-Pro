from .utils import get_or_create_cart

def cart_renderer(request):
    cart = get_or_create_cart(request)
    total_items = sum(item.quantity for item in cart.items.all())
    return {
        'global_cart': cart,
        'cart_total_items': total_items
    }
