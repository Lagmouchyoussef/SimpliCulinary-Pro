import os
import django
from django.utils.text import slugify

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product, Category

def import_all_ateliers_products():
    # Clear existing data to have exactly the products from the workshops
    print("Clearing existing products and categories...")
    Product.objects.all().delete()
    Category.objects.all().delete()

    items = [
        # Workshop 1 & 2
        ('Turbo Professional Blender', 'SimpliCulinary', 'Appliances', 12, 1500.00),
        
        # Workshop 3 & 4
        ('Pro Vacuum Sealer Machine', 'Anova', 'Vacuum Sealers', 10, 11345.00),
        ('Manual Vacuum Sealer Machine', 'SimpliCulinary', 'Vacuum Sealers', 5, 450.00),
        ('Insulated Cooking Container', 'Cadillac', 'Accessories', 5, 890.00),
        ('Cast Iron Skillet', 'FieldCompany', 'Accessories', 11, 1200.00),
        ('Mini Precision Cooker', 'SimpliCulinary', 'Precision Cooker', 7, 2100.00),
        
        # Workshop 6 (Specific variants)
        ('Anova Precision Cooker', 'Anova', 'Precision Cooker', 15, 9141.00),
        ('Anova Precision Vacuum Sealer Pro', 'Anova', 'Vacuum Sealers', 8, 13490.00),
        ('Anova Container', 'Anova', 'Accessories', 20, 11345.00)
    ]
    
    print("Final product consolidation (Workshops 1-6)...")
    for name, brand, cat_name, stock, price in items:
        cat, _ = Category.objects.get_or_create(
            name=cat_name,
            defaults={'slug': slugify(cat_name)}
        )
        
        p, created = Product.objects.get_or_create(
            name=name,
            defaults={
                'description': f'Official {brand} product mentioned in the Workshops. Certified high quality.',
                'price': price,
                'stock': stock,
                'category': cat
            }
        )
        if created:
            print(f"  [+] Added : {name}")
        else:
            # Update price/stock if already present to comply with Workshop 6
            p.price = price
            p.stock = stock
            p.save()
            print(f"  [~] Updated : {name}")

if __name__ == "__main__":
    import_all_ateliers_products()
