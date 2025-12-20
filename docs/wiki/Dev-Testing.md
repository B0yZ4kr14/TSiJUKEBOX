# 🧪 Guia de Testes

Guia completo para testar o TSiJUKEBOX.

---

## 📋 Visão Geral

O TSiJUKEBOX usa:
- **Vitest** para testes unitários
- **Playwright** para testes E2E
- **React Testing Library** para componentes

---

## 🏃 Executando Testes

### Testes Unitários

```bash
# Rodar todos os testes
npm test

# Watch mode
npm run test:watch

# Com coverage
npm run test:coverage

# Arquivo específico
npm test -- src/hooks/player/usePlayer.test.ts
```

### Testes E2E

```bash
# Instalar browsers
npx playwright install

# Rodar E2E
npm run test:e2e

# Com UI
npm run test:e2e:ui

# Arquivo específico
npx playwright test e2e/specs/player-controls.spec.ts
```

---

## 🔬 Testes Unitários

### Estrutura

```
src/
├── hooks/
│   └── player/
│       ├── usePlayer.ts
│       └── __tests__/
│           └── usePlayer.test.ts
├── components/
│   └── player/
│       ├── PlayerControls.tsx
│       └── __tests__/
│           └── PlayerControls.test.tsx
```

### Hook Test

```typescript
// src/hooks/player/__tests__/usePlayer.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePlayer } from '../usePlayer';
import { TestWrapper } from '@/test/utils/testWrapper';

describe('usePlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePlayer(), {
      wrapper: TestWrapper,
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.queue).toEqual([]);
  });

  it('should play a track', async () => {
    const { result } = renderHook(() => usePlayer(), {
      wrapper: TestWrapper,
    });

    const mockTrack = {
      id: '1',
      name: 'Test Song',
      artist: 'Test Artist',
    };

    await act(async () => {
      await result.current.play(mockTrack);
    });

    await waitFor(() => {
      expect(result.current.isPlaying).toBe(true);
      expect(result.current.currentTrack).toEqual(mockTrack);
    });
  });

  it('should handle pause', async () => {
    const { result } = renderHook(() => usePlayer(), {
      wrapper: TestWrapper,
    });

    // Play first
    await act(async () => {
      await result.current.play(mockTrack);
    });

    // Then pause
    await act(async () => {
      result.current.pause();
    });

    expect(result.current.isPlaying).toBe(false);
  });
});
```

### Component Test

```typescript
// src/components/player/__tests__/PlayerControls.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerControls } from '../PlayerControls';
import { TestWrapper } from '@/test/utils/testWrapper';

describe('PlayerControls', () => {
  const defaultProps = {
    isPlaying: false,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
  };

  it('should render play button when not playing', () => {
    render(<PlayerControls {...defaultProps} />, { wrapper: TestWrapper });
    
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  it('should render pause button when playing', () => {
    render(<PlayerControls {...defaultProps} isPlaying />, { wrapper: TestWrapper });
    
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('should call onPlay when play button clicked', async () => {
    render(<PlayerControls {...defaultProps} />, { wrapper: TestWrapper });
    
    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    render(<PlayerControls {...defaultProps} />, { wrapper: TestWrapper });
    
    // All buttons should have accessible names
    expect(screen.getByRole('button', { name: /play/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /next/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /previous/i })).toBeVisible();
  });
});
```

---

## 🎭 Testes E2E

### Estrutura

```
e2e/
├── fixtures/
│   ├── auth.fixture.ts
│   ├── player.fixture.ts
│   └── brand.fixture.ts
├── mocks/
│   └── backup-api.mock.ts
└── specs/
    ├── player-controls.spec.ts
    ├── auth-local.spec.ts
    └── queue-panel.spec.ts
```

### Page Object Pattern

```typescript
// e2e/fixtures/player.fixture.ts
import { test as base, expect } from '@playwright/test';

class PlayerPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async play() {
    await this.page.click('[data-testid="play-button"]');
  }

  async pause() {
    await this.page.click('[data-testid="pause-button"]');
  }

  async isPlaying() {
    return this.page.locator('[data-testid="playing-indicator"]').isVisible();
  }
}

export const test = base.extend<{ playerPage: PlayerPage }>({
  playerPage: async ({ page }, use) => {
    await use(new PlayerPage(page));
  },
});
```

### Spec Test

```typescript
// e2e/specs/player-controls.spec.ts
import { test } from '../fixtures/player.fixture';
import { expect } from '@playwright/test';

test.describe('Player Controls', () => {
  test.beforeEach(async ({ playerPage }) => {
    await playerPage.goto();
  });

  test('should play and pause', async ({ playerPage, page }) => {
    // Play
    await playerPage.play();
    expect(await playerPage.isPlaying()).toBe(true);

    // Pause
    await playerPage.pause();
    expect(await playerPage.isPlaying()).toBe(false);
  });

  test('should navigate to next track', async ({ page }) => {
    // Add tracks to queue first
    await page.click('[data-testid="add-to-queue"]');
    await page.click('[data-testid="add-to-queue"]');
    
    const initialTrack = await page.textContent('[data-testid="current-track"]');
    
    await page.click('[data-testid="next-button"]');
    
    const newTrack = await page.textContent('[data-testid="current-track"]');
    expect(newTrack).not.toBe(initialTrack);
  });

  test('should handle volume control', async ({ page }) => {
    const volumeSlider = page.locator('[data-testid="volume-slider"]');
    
    // Set volume to 50%
    await volumeSlider.fill('50');
    
    expect(await volumeSlider.inputValue()).toBe('50');
  });
});
```

---

## 🎣 Mocking

### Vitest Mocks

```typescript
// Mock de módulo
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}));

// Mock de função
const mockPlay = vi.fn();
vi.spyOn(audioElement, 'play').mockImplementation(mockPlay);
```

### Test Wrapper

```typescript
// src/test/utils/testWrapper.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from '@/contexts/SettingsContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
```

### Mock Data

```typescript
// src/test/mocks/spotifyMocks.ts
export const mockTrack = {
  id: '123',
  name: 'Test Track',
  artists: [{ name: 'Test Artist' }],
  album: {
    name: 'Test Album',
    images: [{ url: 'https://example.com/cover.jpg' }],
  },
  duration_ms: 180000,
};

export const mockPlaylist = {
  id: 'playlist-123',
  name: 'My Playlist',
  tracks: { items: [{ track: mockTrack }] },
};
```

---

## 📊 Coverage

### Configuração

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'src/test/',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
```

### Ver Coverage

```bash
npm run test:coverage
open coverage/index.html
```

---

## 🏃 CI/CD

### GitHub Actions

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:coverage
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📝 Boas Práticas

### Naming

```typescript
// ✅ Bom - Descreve comportamento
it('should display error message when login fails', ...);

// ❌ Evitar - Vago
it('handles error', ...);
```

### Arrange-Act-Assert

```typescript
it('should add track to queue', () => {
  // Arrange
  const { result } = renderHook(() => useQueue());
  const track = mockTrack;

  // Act
  act(() => {
    result.current.addToQueue(track);
  });

  // Assert
  expect(result.current.queue).toContain(track);
});
```

### Test Isolation

```typescript
// Cada teste limpa seu estado
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
```

---

## 🐛 Debugging

### Vitest

```bash
# Modo debug
npm test -- --inspect-brk

# Single test
npm test -- -t "should play track"
```

### Playwright

```bash
# Headed mode (ver browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Trace viewer
npx playwright show-trace trace.zip
```

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [API Reference](Dev-API-Reference.md)

---

[← Contribuir](Dev-Contributing.md) | [← Home](Home.md)
