from rest_framework.authentication import SessionAuthentication


class SessionAuthenticationNoCSRF(SessionAuthentication):
    """Session authentication for the React storefront (different origin, JSON + CORS).

    DRF normally enforces CSRF for session-authenticated requests. The React app lives on another
    origin and talks JSON, so CSRF is skipped here; cross-site requests are still restricted by
    CORS (allowed origins only) and by the JSON-only parsers used on the sensitive endpoints.
    """

    def enforce_csrf(self, request):
        return
