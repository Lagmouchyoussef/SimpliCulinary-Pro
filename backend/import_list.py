import os
import shutil
import django
from django.utils.text import slugify

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product, Category
from django.conf import settings

IMAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sample_images')


def attach_image(product):
    """Copy the HD sample photo for this product into MEDIA_ROOT and attach it."""
    src = os.path.join(IMAGE_DIR, slugify(product.name) + '.jpg')
    if not os.path.exists(src):
        return
    dest_dir = os.path.join(settings.MEDIA_ROOT, 'products')
    os.makedirs(dest_dir, exist_ok=True)
    shutil.copy(src, os.path.join(dest_dir, os.path.basename(src)))
    product.image.name = 'products/' + os.path.basename(src)
    product.save()

def import_catalog():
    # Reset the catalog
    print("Clearing existing products and categories...")
    Product.objects.all().delete()
    Category.objects.all().delete()

    items = [
        # Catalog
        ('Turbo Professional Blender', 'SimpliCulinary', 'Appliances', 12, 1500.00),
        
        # Catalog
        ('Pro Vacuum Sealer Machine', 'Anova', 'Vacuum Sealers', 10, 11345.00),
        ('Manual Vacuum Sealer Machine', 'SimpliCulinary', 'Vacuum Sealers', 5, 450.00),
        ('Insulated Cooking Container', 'Cadillac', 'Accessories', 5, 890.00),
        ('Cast Iron Skillet', 'FieldCompany', 'Accessories', 11, 1200.00),
        ('Mini Precision Cooker', 'SimpliCulinary', 'Precision Cooker', 7, 2100.00),
        
        # Catalog
        ('Anova Precision Cooker', 'Anova', 'Precision Cooker', 15, 9141.00),
        ('Anova Precision Vacuum Sealer Pro', 'Anova', 'Vacuum Sealers', 8, 13490.00),
        ('Anova Container', 'Anova', 'Accessories', 20, 11345.00)
    ]
    
    print("Importing the catalog...")
    for name, brand, cat_name, stock, price in items:
        cat, _ = Category.objects.get_or_create(
            name=cat_name,
            defaults={'slug': slugify(cat_name)}
        )
        
        p, created = Product.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Genuine {brand} equipment built for precision, durability and professional results in your home kitchen.',
                'price': price,
                'stock': stock,
                'category': cat
            }
        )
        if created:
            print(f"  [+] Added : {name}")
        else:
            # Update price/stock if already present to match the catalog
            p.price = price
            p.stock = stock
            p.save()
            print(f"  [~] Updated : {name}")
        attach_image(p)

if __name__ == "__main__":
    import_catalog()
