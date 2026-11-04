"""Payment helpers.

IMPORTANT: this module is a *demo gateway*. It validates card details and simulates an
authorisation, but it never contacts a real payment provider and never charges real money.
Card numbers, expiry dates and CVC codes are validated and then discarded: only the brand
and the last four digits are kept on the order.

To go live, replace `process_payment` with a real integration (Stripe, PayPal, Apple Pay /
Google Pay through your PSP, a crypto processor such as Coinbase Commerce, ...).
"""
import re
import uuid
from datetime import date

PAYMENT_METHODS = [
    ('card', 'Credit / debit card'),
    ('paypal', 'PayPal'),
    ('google_pay', 'Google Pay'),
    ('apple_pay', 'Apple Pay'),
    ('crypto', 'Cryptocurrency'),
]

CRYPTO_COINS = [
    ('BTC', 'Bitcoin (BTC)'),
    ('ETH', 'Ethereum (ETH)'),
    ('USDT', 'Tether (USDT)'),
    ('USDC', 'USD Coin (USDC)'),
]

# Stripe-style test number that is always declined (to demo the failure path)
DECLINED_TEST_CARD = '4000000000000002'


class PaymentError(Exception):
    """Raised when a payment cannot be authorised."""


def clean_card_number(value):
    return re.sub(r'[\s-]', '', value or '')


def luhn_valid(number):
    if not number.isdigit() or not 12 <= len(number) <= 19:
        return False
    total = 0
    for index, digit in enumerate(reversed(number)):
        n = int(digit)
        if index % 2 == 1:
            n *= 2
            if n > 9:
                n -= 9
        total += n
    return total % 10 == 0


def detect_brand(number):
    if re.match(r'^3[47]', number):
        return 'American Express'
    if re.match(r'^4', number):
        return 'Visa'
    if re.match(r'^(5[1-5]|2(2[2-9][1-9]|2[3-9]|[3-6]|7[01]|720))', number):
        return 'Mastercard'
    return 'Card'


def parse_expiry(value):
    """Return (month, year) from 'MM/YY' or 'MM/YYYY', or None when invalid."""
    match = re.match(r'^\s*(\d{1,2})\s*/\s*(\d{2}|\d{4})\s*$', value or '')
    if not match:
        return None
    month, year = int(match.group(1)), int(match.group(2))
    if year < 100:
        year += 2000
    if not 1 <= month <= 12:
        return None
    return month, year


def expiry_in_future(month, year):
    today = date.today()
    return (year, month) >= (today.year, today.month)


def process_payment(method, amount, card=None, coin=None):
    """Simulate the authorisation of a payment and return a dict describing it."""
    if method == 'card':
        number = clean_card_number(card['number'])
        if number == DECLINED_TEST_CARD:
            raise PaymentError('Your card was declined. Please try another payment method.')
        brand = detect_brand(number)
        return {
            'reference': f'DEMO-CARD-{uuid.uuid4().hex[:10].upper()}',
            'details': f'{brand} ending {number[-4:]}',
        }
    if method == 'crypto':
        return {
            'reference': f'DEMO-TX-{uuid.uuid4().hex[:16].upper()}',
            'details': f'{coin or "BTC"} payment',
        }
    labels = dict(PAYMENT_METHODS)
    return {
        'reference': f'DEMO-{method.upper()}-{uuid.uuid4().hex[:10].upper()}',
        'details': labels.get(method, method),
    }
