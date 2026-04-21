from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.views import LoginView, LogoutView
from .forms import CustomUserCreationForm
from .models import CustomUser

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
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
            # Check if user already exists
            if CustomUser.objects.filter(username=data.get('username')).exists():
                return Response({"error": "This username is already taken"}, status=status.HTTP_400_BAD_REQUEST)
            if CustomUser.objects.filter(email=data.get('email')).exists():
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
            
            # Log in user after registration
            login(request, user)
            
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "message": "Account created successfully"
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SignupView(CreateView):

    form_class = CustomUserCreationForm
    template_name = 'users/signup.html'
    success_url = reverse_lazy('login')

class CustomLoginView(LoginView):
    template_name = 'users/login.html'

class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('home')
