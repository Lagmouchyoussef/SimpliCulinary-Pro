from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class NewsletterAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Envoyer l'email
            subject = "Bienvenue dans la Newsletter E-Vente !"
            message = f"""
            Bonjour,
            
            Merci de vous être inscrit à la newsletter de E-Vente (Atelier Django).
            Vous recevrez désormais nos meilleures offres culinaires en avant-première !
            
            L'équipe E-Vente.
            """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]
            
            # fail_silently=True permet d'éviter de bloquer le site si le SMTP n'est pas prêt
            send_mail(subject, message, from_email, recipient_list, fail_silently=True)
            
            return Response({"message": "Inscription réussie"}, status=status.HTTP_200_OK)
        except Exception as e:
            # Même en cas d'erreur technique, on valide l'inscription côté client
            return Response({"message": "Inscription enregistrée"}, status=status.HTTP_200_OK)

from products.models import Product

class HomeView(View):
    def get(self, request):
        featured_products = Product.objects.all()[:3]
        return render(request, 'base/home.html', {'featured_products': featured_products})
