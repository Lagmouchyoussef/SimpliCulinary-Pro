from django.core.management.base import BaseCommand
from faker import Faker
from products.models import Category, Product
import random

class Command(BaseCommand):
    help = 'Generates fake data for products'

    def handle(self, *args, **options):
        faker = Faker('en_US') # use English language

        # create 5 categories
        categories = []
        for _ in range(5):
            name = faker.word().capitalize()
            slug = faker.slug(name)
            # Use get_or_create to avoid duplicates if command is run multiple times
            category, created = Category.objects.get_or_create(name=name, slug=slug)
            categories.append(category)
            if created:
                self.stdout.write(f"Category created successfully : {name}")

        # create products
        for i in range(8):
            Product.objects.create(
                name=faker.sentence(nb_words=4).replace('.', ''),
                description=faker.text(max_nb_chars=450),
                price=faker.random_number(digits=4),
                stock=faker.random_int(0, 100),
                category=random.choice(categories)
            )
            self.stdout.write(f"Product {i+1} created successfully")
