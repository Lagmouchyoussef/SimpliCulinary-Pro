from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=250, unique=True, verbose_name="Name")
    slug = models.SlugField(max_length=250, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=250, verbose_name="Name")
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Price")
    stock = models.PositiveIntegerField(default=0, verbose_name="Quantity in stock")
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True, verbose_name="Category")
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    def __str__(self):
        return self.name
