import os
import requests
import django
from django.core.files.base import ContentFile
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product
from django.conf import settings

def set_smart_images():
    products = Product.objects.all()
    os.makedirs(os.path.join(settings.MEDIA_ROOT, 'products'), exist_ok=True)
    
    print(f"Searching for matching images for {products.count()} products...")
    
    for p in products:
        # Extract keywords from name (e.g. 'Pro Vacuum Sealer' -> 'vacuum')
        # Take words with more than 3 letters
        clean_name = re.sub(r'[^a-zA-Z\s]', '', p.name).lower()
        keywords = [w for w in clean_name.split() if len(w) > 3]
        
        # If no keyword found, use 'kitchen'
        search_term = keywords[0] if keywords else "kitchen"
        
        # Basic translation or common English keywords for better results
        translations = {
            'mixeur': 'blender',
            'poele': 'frying-pan',
            'cuiseur': 'cooker',
            'emballer': 'vacuum-sealer',
            'recipient': 'container',
            'couteau': 'knife',
            'four': 'oven',
            'grille': 'toaster'
        }
        
        final_term = translations.get(search_term, search_term)
        
        url = f'https://loremflickr.com/600/400/{final_term},product?lock={p.id}'
        
        print(f"  > Search : '{p.name}' -> Term : '{final_term}'")
        
        try:
            response = requests.get(url, timeout=15)
            if response.status_code == 200:
                # Supprimer l'ancienne image si elle existe
                if p.image:
                    try:
                        os.remove(p.image.path)
                    except:
                        pass
                
                p.image.save(f'product_{p.id}.jpg', ContentFile(response.content), save=True)
                print(f"    [OK] Image updated.")
            else:
                print(f"    [!] Failed (Status {response.status_code})")
        except Exception as e:
            print(f"    [X] Error : {e}")

if __name__ == "__main__":
    set_smart_images()
