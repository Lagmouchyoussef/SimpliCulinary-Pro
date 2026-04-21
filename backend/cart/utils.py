from .models import Cart

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        
        # Note: In the diagram, Cart doesn't have a session_key field yet.
        # But the code snippet on page 17 uses it. 
        # I'll need to update the model.
        cart, _ = Cart.objects.get_or_create(session_key=session_key)
        
    return cart
