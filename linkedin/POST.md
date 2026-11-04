# LinkedIn post kit

## Suggested order of images (carousel)

| # | File | Use |
|---|------|-----|
| 1 | `01-cover.png` | Cover / first image (the hook) |
| 2 | `02-catalog.png` | Storefront and catalog |
| 3 | `04-flow.png` | Cart, account, payment flow |
| 4 | `03-checkout.png` | Payment methods |
| 5 | `05-responsive.png` | Responsive design |
| 6 | `06-architecture.png` | Architecture |
| 7 | `07-features.png` | What I built and learned |

`00-profile-logo-800.png` is the square logo (for a company page or a profile picture).
All slides are 2400 x 1254 px (LinkedIn recommended 1.91:1 ratio, rendered at 2x for sharpness).

---

## Post text (English)

I just shipped **SimpliCulinary**, a full-stack e-commerce platform for professional kitchen equipment. 🍳

What it includes:
✅ Django REST API + a React storefront (and a server-rendered Django version) sharing one design system
✅ A cart that never loses items: guest carts are merged into the account at login or sign-up
✅ Account-gated checkout with Visa, Mastercard, American Express, PayPal, Google Pay, Apple Pay and crypto
✅ Server-side validation, stock locking against overselling, and no card data stored
✅ Custom logo, responsive UI, fully in English

The biggest lesson: a "simple" cart gets tricky fast. Sessions rotate on login, REST authentication can silently hide the real user, and checkout must be atomic. Fixing those made the whole flow reliable.

The payment step is a demo gateway for now (no real charges). Next: Stripe/PayPal integration, order history and an automated test suite.

Code, screenshots and docs on GitHub:
👉 https://github.com/Lagmouchyoussef/SimpliCulinary-Pro

I would love your feedback! 💬

#Django #Python #React #WebDevelopment #FullStack #Ecommerce #RESTAPI #SoftwareEngineering #Portfolio #OpenSource

---

## Tips

- Post the GitHub link in the first comment too (LinkedIn can reduce reach of posts with external links).
- Best time: Tuesday to Thursday, morning.
- Tag people or companies only if relevant (for example mentors or teachers).
