# Testing Guide

This guide covers testing practices, tools, and conventions for TSiJUKEBOX.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Stack](#test-stack)
- [Running Tests](#running-tests)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Coverage](#coverage)
- [Best Practices](#best-practices)

---

## Overview

TSiJUKEBOX uses a multi-layer testing strategy:

| Layer | Tool | Location | Purpose |
|-------|------|----------|---------|
| Unit | Vitest | `src/**/__tests__/` | Component/hook logic |
| Integration | Vitest | `src/**/*.integration.test.ts` | Cross-component flows |
| E2E | Playwright | `e2e/specs/` | User journeys |

---

## Test Stack

### Vitest (Unit & Integration)

- **Framework**: [Vitest](https://vitest.dev/) — Vite-native test runner
- **Assertions**: Built-in expect + Jest-compatible matchers
- **DOM Testing**: [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- **Mocking**: Vitest built-in mocks

### Playwright (E2E)

- **Framework**: [Playwright](https://playwright.dev/)
- **Browsers**: Chromium, Firefox, WebKit
- **Fixtures**: Custom fixtures in `e2e/fixtures/`

---

## Running Tests

```bash
# Unit tests
npm run test                    # Run all unit tests
npm run test -- --watch         # Watch mode
npm run test -- --coverage      # With coverage

# Specific file
npm run test -- src/hooks/player/__tests__/useVolume.test.ts

# E2E tests
npx playwright test             # Run all E2E tests
npx playwright test --ui        # Interactive UI mode
npx playwright test --project=chromium  # Single browser
```

---

## Unit Testing

### File Structure

```
src/hooks/player/
├── useVolume.ts
├── __tests__/
│   └── useVolume.test.ts
```

### Example Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVolume } from '../useVolume';

describe('useVolume', () => {
  it('should initialize with default volume', () => {
    const { result } = renderHook(() => useVolume());
    expect(result.current.volume).toBe(1);
  });

  it('should update volume', () => {
    const { result } = renderHook(() => useVolume());
    act(() => {
      result.current.setVolume(0.5);
    });
    expect(result.current.volume).toBe(0.5);
  });

  it('should clamp volume between 0 and 1', () => {
    const { result } = renderHook(() => useVolume());
    act(() => {
      result.current.setVolume(2);
    });
    expect(result.current.volume).toBe(1);
  });
});
```

### Testing Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { VolumeSlider } from '../VolumeSlider';

describe('VolumeSlider', () => {
  it('renders with current volume', () => {
    render(<VolumeSlider volume={0.5} onChange={() => {}} />);
    expect(screen.getByRole('slider')).toHaveValue('50');
  });

  it('calls onChange when adjusted', () => {
    const onChange = vi.fn();
    render(<VolumeSlider volume={0.5} onChange={onChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });
    expect(onChange).toHaveBeenCalledWith(0.75);
  });
});
```

---

## Integration Testing

Integration tests verify multiple units working together.

### Naming Convention

```
useBackupManager.integration.test.ts
```

### Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBackupManager } from '../useBackupManager';
import { createWrapper } from '@/test/utils/createWrapper';

describe('BackupManager Integration', () => {
  beforeEach(() => {
    // Reset state between tests
  });

  it('creates and restores backup', async () => {
    const { result } = renderHook(() => useBackupManager(), {
      wrapper: createWrapper(),
    });

    // Create backup
    await act(async () => {
      await result.current.createBackup();
    });

    await waitFor(() => {
      expect(result.current.backups).toHaveLength(1);
    });

    // Restore backup
    await act(async () => {
      await result.current.restoreBackup(result.current.backups[0].id);
    });

    expect(result.current.lastRestore).toBeDefined();
  });
});
```

---

## E2E Testing

### File Structure

```
e2e/
├── fixtures/           # Custom Playwright fixtures
│   ├── auth.fixture.ts
│   └── brand.fixture.ts
├── mocks/              # API mocks
├── specs/              # Test specifications
│   ├── auth.spec.ts
│   ├── player.spec.ts
│   └── track-playback.spec.ts
```

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Player Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('plays and pauses track', async ({ page }) => {
    // Start playback
    await page.click('[data-testid="play-button"]');
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();

    // Pause playback
    await page.click('[data-testid="pause-button"]');
    await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
  });

  test('adjusts volume', async ({ page }) => {
    const volumeSlider = page.locator('[data-testid="volume-slider"]');
    await volumeSlider.fill('50');
    await expect(volumeSlider).toHaveValue('50');
  });
});
```

---

## Coverage

### Configuration

Coverage is configured in `vitest.config.ts`:

```typescript
coverage: {
  reporter: ['text', 'json', 'html', 'lcov'],
  reportsDirectory: './coverage/vitest',
  include: [
    'src/hooks/**/*.ts',
    'src/components/**/*.tsx',
    'src/contexts/**/*.tsx',
    'src/lib/**/*.ts',
  ],
  exclude: [
    'src/**/index.ts',
    'src/**/*.test.{ts,tsx}',
    'src/test/**',
  ],
}
```

### Viewing Coverage

```bash
# Generate coverage report
npm run test -- --coverage

# View HTML report
open coverage/vitest/index.html
```

### Coverage Goals

| Area | Target | Current |
|------|--------|---------|
| Hooks | 80% | — |
| Components | 70% | — |
| Contexts | 80% | — |
| Lib | 90% | — |

---

## Best Practices

### General

1. **Test behavior, not implementation**
2. **One assertion per test** (when practical)
3. **Descriptive test names** — "should [action] when [condition]"
4. **Arrange-Act-Assert** pattern
5. **Mock external dependencies**

### Hooks

```typescript
// ✅ Good: Test the public API
it('returns loading state while fetching', () => {
  const { result } = renderHook(() => useFetch('/api/data'));
  expect(result.current.isLoading).toBe(true);
});

// ❌ Bad: Testing internal implementation
it('calls fetch with correct URL', () => {
  // Don't test how it works, test what it does
});
```

### Components

```typescript
// ✅ Good: Test user interaction
it('submits form when button clicked', async () => {
  const onSubmit = vi.fn();
  render(<Form onSubmit={onSubmit} />);
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(onSubmit).toHaveBeenCalled();
});

// ❌ Bad: Testing internal state
it('sets isSubmitting to true', () => {
  // Users don't care about internal state
});
```

### Mocking

```typescript
// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

// Mock hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '123', email: 'test@example.com' },
    isAuthenticated: true,
  }),
}));
```

---

## CI Integration

Tests run automatically on PR:

```yaml
# .github/workflows/tsijukebox-cicd.yml
- name: Run Vitest
  run: npm run test -- --coverage --reporter=verbose

- name: Run Playwright
  run: npx playwright test --project=chromium
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Philosophy](https://kentcdodds.com/blog/testing-implementation-details)

---

<p align="center">
  Tests are documentation that never lies.
</p>
