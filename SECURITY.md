# Security Policy

## Reporting Security Vulnerabilities

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in TSiJUKEBOX, please report it responsibly:

1. **Do not** open a public issue
2. Contact the maintainers directly through GitHub
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

We will acknowledge receipt within 48 hours and provide a detailed response within 7 days.

## Security Measures

TSiJUKEBOX implements security at multiple layers:

| Layer | Protection |
|-------|------------|
| **Authentication** | Supabase Auth with JWT, OAuth 2.0 |
| **Database** | Row Level Security (RLS) policies |
| **API** | Rate limiting, input validation with Zod |
| **Frontend** | XSS prevention, CSP headers |
| **Secrets** | Environment variables, never in code |

For detailed security documentation, see:

📖 **[Security Guide](docs/SECURITY.md)**

## Supported Versions

| Version | Supported |
|---------|-----------|
| 4.x.x   | ✅ Active  |
| 3.x.x   | ⚠️ Security fixes only |
| < 3.0   | ❌ End of life |

## Best Practices for Users

- Keep your installation updated
- Use strong, unique passwords
- Enable two-factor authentication when available
- Regularly rotate API keys
- Review access logs periodically

---

**TSiJUKEBOX Enterprise** — Security is everyone's responsibility.
