# Configuration Files

This directory contains project-wide configuration files that are shared across environments or tools.

## Purpose

Configuration files that need to be:
- Shared across different environments
- Version controlled but separate from source code
- Easily discoverable and maintained

## Current Configurations

| File | Purpose | Documentation |
|------|---------|---------------|
| *No configs yet* | — | — |

## Environment-Specific Files

For environment-specific configurations, use:

| Environment | Location |
|-------------|----------|
| Development | `.env` (local, not committed) |
| Template | `.env.example` (root) |
| Docker | `docker/` directory |
| Supabase | `supabase/` directory |

## Guidelines

1. **Never commit secrets** — use environment variables
2. **Document each config** — add entry to this README
3. **Use semantic names** — `database.config.ts` not `db.ts`
4. **Include comments** — explain non-obvious settings

---

See also:
- [docs/CONFIGURATION.md](../docs/CONFIGURATION.md) — Configuration guide
- [.env.example](../.env.example) — Environment variable template
