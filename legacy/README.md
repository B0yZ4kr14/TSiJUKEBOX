# Legacy Code

This directory contains deprecated or obsolete code that has been preserved for reference.

## Purpose

- **Preservation**: Code moved here is kept for historical reference and potential rollback
- **Documentation**: Each item includes notes explaining why it was deprecated
- **Migration**: Legacy code can be referenced when migrating to new implementations

## Guidelines

When moving code to `/legacy`:

1. **Create a dated subdirectory**: e.g., `2024-12-20_old-auth-system/`
2. **Add a README.md** explaining:
   - What the code did
   - Why it was deprecated
   - What replaced it
   - Any relevant ADR reference
3. **Update imports** in the active codebase to use new implementations
4. **Do not delete** — only move here

## Current Contents

*No legacy code yet — this directory is ready for future deprecations.*

---

> **Note**: This directory follows the project's "no delete" policy. 
> Obsolete files are moved here instead of being removed.
