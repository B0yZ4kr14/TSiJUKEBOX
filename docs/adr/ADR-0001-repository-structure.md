# ADR-0001: Repository Structure and Organization

## Status

**Accepted** — 2024-12-21

## Context

TSiJUKEBOX evolved from a personal project to an enterprise-grade PWA. As the codebase grew, the need for clear organization became evident:

- **Discovery**: New contributors struggled to find relevant files
- **Conventions**: No clear standard for where new code should go
- **Documentation**: Docs scattered across multiple locations
- **Preservation**: No policy for handling deprecated code

The repository needed a professional structure that:
1. Follows industry best practices
2. Scales with team growth
3. Preserves existing functionality
4. Documents architectural decisions

## Decision

We adopt the following repository structure:

```
tsijukebox/
├── src/                    # Application source code
│   ├── components/         # React components (by feature)
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks (by domain)
│   ├── lib/                # Utility libraries
│   ├── pages/              # Route pages
│   ├── test/               # Test utilities and fixtures
│   ├── types/              # TypeScript type definitions
│   └── integrations/       # External API integrations
├── docs/                   # Project documentation
│   ├── adr/                # Architecture Decision Records
│   └── wiki/               # Wiki content
├── e2e/                    # End-to-end tests (Playwright)
├── scripts/                # Build/utility scripts
├── configs/                # Shared configuration files
├── legacy/                 # Preserved deprecated code
├── public/                 # Static assets
├── docker/                 # Docker configurations
├── packaging/              # Distribution packages (AUR, etc.)
└── supabase/               # Supabase configurations
```

### Root-Level Files

| File | Purpose |
|------|---------|
| README.md | Project overview and quick start |
| CONTRIBUTING.md | Contribution guidelines (summary) |
| SECURITY.md | Security policy and reporting |
| CHANGELOG.md | Version history (summary) |
| LICENSE | Public domain declaration |
| CODE_OF_CONDUCT.md | Community standards |
| .env.example | Environment variable template |

### Key Principles

1. **No Deletion Policy**: Obsolete code moves to `/legacy` with documentation
2. **Feature-Based Organization**: Components grouped by domain, not type
3. **ADR Documentation**: Significant decisions recorded in `/docs/adr`
4. **Dual Documentation**: Summary at root, details in `/docs`

## Consequences

### Positive

- **Discoverability**: Clear conventions for file placement
- **Onboarding**: New contributors can find code quickly
- **Preservation**: No accidental loss of historical code
- **Governance**: ADRs track decision history

### Negative

- **Initial Overhead**: Requires documenting existing structure
- **Migration Effort**: Some files may need relocation
- **Maintenance**: ADRs require ongoing updates

### Neutral

- **No Breaking Changes**: All paths remain valid
- **Gradual Adoption**: Can be implemented incrementally

## References

- [Standard Repository Structure](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories)
- [ADR Format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [Monorepo vs Polyrepo](https://monorepo.tools/)

---

**Authors**: Repository Architect Agent  
**Reviewers**: Maintainers
