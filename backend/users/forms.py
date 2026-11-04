from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'phone', 'address']
        labels = {'first_name': 'First name', 'last_name': 'Last name', 'phone': 'Phone number'}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        placeholders = {
            'first_name': 'Jane',
            'last_name': 'Doe',
            'username': 'Choose a username',
            'email': 'you@example.com',
            'phone': '+212 6 00 00 00 00',
            'address': 'Street, city, postal code',
        }
        # Hide verbose help text and add friendly placeholders
        for name, field in self.fields.items():
            field.help_text = None
            if name in placeholders:
                field.widget.attrs['placeholder'] = placeholders[name]
