from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from products.models import Product


@method_decorator(csrf_exempt, name='dispatch')
class NewsletterAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "Please enter a valid email address"}, status=status.HTTP_400_BAD_REQUEST)

        subject = "Welcome to the SimpliCulinary Newsletter!"
        message = (
            "Hello,\n\n"
            "Thank you for subscribing to the SimpliCulinary newsletter.\n"
            "You will now receive our best culinary offers, recipes and expert tips first.\n\n"
            "The SimpliCulinary Team"
        )

        try:
            # fail_silently=True keeps the site responsive if SMTP is not configured yet
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=True)
        except Exception:
            # Even on a technical error, the subscription is acknowledged client-side
            pass

        return Response({"message": "Subscription successful"}, status=status.HTTP_200_OK)


class HomeView(View):
    def get(self, request):
        featured_products = Product.objects.select_related('category')[:3]
        return render(request, 'base/home.html', {'featured_products': featured_products})
