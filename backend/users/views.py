from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import redirect, resolve_url
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import CreateView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from base.authentication import SessionAuthenticationNoCSRF
from cart.utils import merge_guest_cart
from .forms import CustomUserCreationForm
from .models import CustomUser


def _safe_next(request, default):
    """Return the ?next= / POSTed next URL when it points to this site, else the default."""
    target = request.POST.get('next') or request.GET.get('next') or ''
    if target and url_has_allowed_host_and_scheme(target, allowed_hosts={request.get_host()}):
        return target
    return resolve_url(default)


def _login_and_merge_cart(request, user):
    """Log the user in without losing the guest cart.

    Django rotates the session key on login, so the guest cart (bound to the old key)
    must be merged into the user's cart using the key captured beforehand.
    """
    old_key = request.session.session_key
    login(request, user)
    merge_guest_cart(old_key, user)


@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            _login_and_merge_cart(request._request, user)
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "message": "Login successful"
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class SignupAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        data = request.data
        try:
            if not data.get('username') or not data.get('password'):
                return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
            if CustomUser.objects.filter(username=data.get('username')).exists():
                return Response({"error": "This username is already taken"}, status=status.HTTP_400_BAD_REQUEST)
            if data.get('email') and CustomUser.objects.filter(email=data.get('email')).exists():
                return Response({"error": "This email is already used"}, status=status.HTTP_400_BAD_REQUEST)

            user = CustomUser.objects.create_user(
                username=data.get('username'),
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                phone=data.get('phone', ''),
                address=data.get('address', '')
            )

            _login_and_merge_cart(request._request, user)

            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "message": "Account created successfully"
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class SessionAPIView(APIView):
    """Tell the React app whether the browser session is logged in."""
    authentication_classes = [SessionAuthenticationNoCSRF]
    permission_classes = []

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({"id": user.id, "username": user.username, "email": user.email})
        return Response({"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        logout(request._request)
        return Response({"message": "Logged out"})


class SignupView(CreateView):
    """Create the account, log the user in, keep the cart and continue (e.g. to checkout)."""
    form_class = CustomUserCreationForm
    template_name = 'users/signup.html'

    def form_valid(self, form):
        self.object = form.save()
        _login_and_merge_cart(self.request, self.object)
        return redirect(_safe_next(self.request, 'home'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['next'] = self.request.GET.get('next', '')
        return context


class CustomLoginView(LoginView):
    template_name = 'users/login.html'

    def form_valid(self, form):
        old_key = self.request.session.session_key
        response = super().form_valid(form)
        merge_guest_cart(old_key, form.get_user())
        return response


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('home')
