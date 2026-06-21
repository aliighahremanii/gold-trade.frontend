# Identity Frontend Knowledge

Identity owns authentication, sessions, user account entry points, and auth-related UX.

Frontend responsibilities:

- sign-in
- sign-up
- OTP/verification flow if exposed
- session restore/loading states
- auth guard for customer/admin route groups
- introspection/session display if needed

Do not duplicate backend auth rules. Do not store tokens insecurely. Prefer HttpOnly cookie/session patterns if supported by backend.
