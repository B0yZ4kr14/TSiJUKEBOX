# CI/CD Pipeline

This document describes the Continuous Integration and Continuous Deployment pipeline for TSiJUKEBOX.

## 📋 Table of Contents

- [Overview](#overview)
- [Pipeline Stages](#pipeline-stages)
- [Workflows](#workflows)
- [Running Locally](#running-locally)
- [Troubleshooting](#troubleshooting)

---

## Overview

TSiJUKEBOX uses GitHub Actions for CI/CD automation:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Lint &    │ → │    Unit     │ → │   Build     │ → │   Deploy    │
│ Type Check  │    │   Tests     │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       └──────────────────┴──────────────────┴──────────────────┘
                          ↓
                    E2E Tests (parallel)
```

---

## Pipeline Stages

### 1. Lint & Type Check

**Trigger**: Every push and PR

| Check | Tool | Command |
|-------|------|---------|
| ESLint | `eslint` | `npm run lint` |
| TypeScript | `tsc` | `npx tsc --noEmit` |
| Prettier | `prettier` | `npx prettier --check "src/**/*.{ts,tsx}"` |

### 2. Unit Tests

**Trigger**: After lint passes

```bash
npm run test -- --coverage --reporter=verbose
```

- **Framework**: Vitest
- **Coverage**: Uploaded as artifact
- **Reports**: Available in GitHub Actions

### 3. E2E Tests

**Trigger**: Parallel with unit tests

```bash
npx playwright install --with-deps chromium
npm run build
npx playwright test --project=chromium
```

- **Framework**: Playwright
- **Browsers**: Chromium (CI), all browsers (local)
- **Reports**: Uploaded as artifact

### 4. Build

**Trigger**: After all tests pass

```bash
npm run build
```

- **Output**: `dist/` directory
- **PWA**: Service worker generated
- **Artifacts**: Retained for 30 days

### 5. Security Scan

**Trigger**: Parallel with tests

| Scan | Purpose |
|------|---------|
| `npm audit` | Dependency vulnerabilities |
| `depcheck` | Unused dependencies |
| Secret scan | Credentials in code |

### 6. AUR Package

**Trigger**: Main branch or tags

```bash
# Runs in Arch Linux container
makepkg --printsrcinfo > .SRCINFO
namcap PKGBUILD
```

### 7. GitHub Release

**Trigger**: Version tags (`v*.*.*`)

- Creates GitHub release
- Uploads build artifacts
- Generates changelog from commits

---

## Workflows

### Main Pipeline

**File**: `.github/workflows/tsijukebox-cicd.yml`

| Job | Description | Depends On |
|-----|-------------|------------|
| `lint` | ESLint + TypeScript | — |
| `test-unit` | Vitest tests | lint |
| `test-e2e` | Playwright tests | lint |
| `python-lint` | Python script validation | — |
| `build` | Production build | test-unit, test-e2e |
| `aur-build` | Arch Linux package | build |
| `aur-publish` | Publish to AUR | aur-build |
| `release` | GitHub Release | build, aur-build |
| `security-scan` | Vulnerability scan | lint |
| `lighthouse` | Performance audit | build |
| `badges` | Deploy status badges | test-unit, test-e2e |

### Accessibility Checks

**File**: `.github/workflows/accessibility.yml`

- WCAG validation
- Contrast checking
- Native element verification

### Brand Components

**File**: `.github/workflows/brand-components.yml`

- Brand component tests
- Animation validation
- Logo variants check

---

## Running Locally

### Full Pipeline

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Type check
npx tsc --noEmit

# Unit tests with coverage
npm run test -- --coverage

# Build
npm run build

# E2E tests (requires build)
npx playwright install
npx playwright test
```

### Quick Validation

```bash
# Fast check before commit
npm run lint && npx tsc --noEmit && npm run test
```

### Husky Pre-commit

The `.husky/pre-commit` hook runs automatically:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test -- --changed
```

---

## Troubleshooting

### Common Issues

#### "ESLint: Cannot find module"

```bash
# Reinstall dependencies
rm -rf node_modules
npm ci --legacy-peer-deps
```

#### "Playwright browsers not installed"

```bash
npx playwright install --with-deps
```

#### "Build fails with memory error"

```bash
# Increase Node.js heap size
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

#### "Tests timeout in CI"

Tests have longer timeouts in CI. Check for:
- Unresolved promises
- Missing async/await
- Network requests without mocks

### Viewing Artifacts

1. Go to Actions tab in GitHub
2. Select the workflow run
3. Scroll to "Artifacts" section
4. Download:
   - `coverage-unit` - Test coverage report
   - `playwright-report` - E2E test report
   - `lighthouse-report` - Performance audit
   - `dist` - Production build

### Re-running Failed Jobs

1. Go to the failed workflow run
2. Click "Re-run failed jobs" (top right)
3. Or click on specific job → "Re-run"

---

## Environment Variables

### Required for CI

| Variable | Source | Purpose |
|----------|--------|---------|
| `GITHUB_TOKEN` | Automatic | GitHub API access |
| `NODE_VERSION` | Workflow | Node.js version |

### Optional Secrets

| Secret | Purpose |
|--------|---------|
| `AUR_SSH_PRIVATE_KEY` | AUR publishing |
| `SUPABASE_PROJECT_REF` | E2E tests |

---

## Badge Integration

Status badges are deployed to GitHub Pages:

```markdown
![Build](https://img.shields.io/endpoint?url=https://your-org.github.io/tsijukebox/coverage/badges/build.json)
![Coverage](https://img.shields.io/endpoint?url=https://your-org.github.io/tsijukebox/coverage/badges/coverage.json)
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest CI Configuration](https://vitest.dev/guide/ci.html)
- [Playwright CI Setup](https://playwright.dev/docs/ci)

---

<p align="center">
  Automate everything, trust nothing.
</p>
