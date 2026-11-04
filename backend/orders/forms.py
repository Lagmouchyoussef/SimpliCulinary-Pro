from django import forms

from . import payments


class CheckoutForm(forms.Form):
    """Shipping address + payment method (+ card details for card payments)."""

    shipping_address = forms.CharField(
        label='Shipping address',
        widget=forms.Textarea(attrs={'rows': 3, 'placeholder': 'Street, number, city, postal code, country'}),
    )
    payment_method = forms.ChoiceField(choices=payments.PAYMENT_METHODS, initial='card')
    crypto_coin = forms.ChoiceField(choices=payments.CRYPTO_COINS, required=False, initial='BTC')
    card_name = forms.CharField(label='Name on card', required=False, max_length=80)
    card_number = forms.CharField(label='Card number', required=False, max_length=23)
    card_expiry = forms.CharField(label='Expiry (MM/YY)', required=False, max_length=9)
    card_cvc = forms.CharField(label='CVC', required=False, max_length=4)

    def clean(self):
        data = super().clean()
        if data.get('payment_method') != 'card':
            return data

        number = payments.clean_card_number(data.get('card_number'))
        if not payments.luhn_valid(number):
            self.add_error('card_number', 'Enter a valid card number.')
        if not (data.get('card_name') or '').strip():
            self.add_error('card_name', 'Enter the name on the card.')

        expiry = payments.parse_expiry(data.get('card_expiry'))
        if not expiry or not payments.expiry_in_future(*expiry):
            self.add_error('card_expiry', 'Enter a valid, future expiry date (MM/YY).')

        cvc = (data.get('card_cvc') or '').strip()
        expected = 4 if payments.detect_brand(number) == 'American Express' else 3
        if not cvc.isdigit() or len(cvc) != expected:
            self.add_error('card_cvc', f'Enter the {expected}-digit security code.')
        return data

    def card_data(self):
        return {'number': self.cleaned_data.get('card_number', '')}
