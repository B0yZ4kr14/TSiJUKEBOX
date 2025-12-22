/**
 * E2E Tests: Route Validation
 * 
 * Validates that all application routes load correctly after refactoring.
 * Tests cover public, protected, and integration-specific routes.
 * 
 * @see docs/ROUTES.md for complete route documentation
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// Route Definitions
// ============================================================================

const publicRoutes = [
  { path: '/', name: 'Index', expectedContent: /jukebox|music|player/i },
  { path: '/auth', name: 'Auth', expectedContent: /login|sign in|entrar/i },
  { path: '/help', name: 'Help', expectedContent: /help|ajuda|support/i },
  { path: '/wiki', name: 'Wiki', expectedContent: /wiki|documentation|docs/i },
  { path: '/landing', name: 'Landing', expectedContent: /welcome|bem-vindo/i },
  { path: '/install', name: 'Install', expectedContent: /install|instalar|download/i },
  { path: '/brand', name: 'Brand Guidelines', expectedContent: /brand|marca|logo/i },
  { path: '/changelog', name: 'Changelog', expectedContent: /changelog|version|versão/i },
  { path: '/showcase', name: 'Components Showcase', expectedContent: /components|showcase/i },
];

const spotifyRoutes = [
  { path: '/spotify', name: 'Spotify Browser', expectedContent: /spotify|browse|navegar/i },
  { path: '/spotify/search', name: 'Spotify Search', expectedContent: /search|buscar|pesquisar/i },
  { path: '/spotify/library', name: 'Spotify Library', expectedContent: /library|biblioteca/i },
  { path: '/spotify/playlist', name: 'Spotify Playlist', expectedContent: /playlist/i },
];

const youtubeRoutes = [
  { path: '/youtube-music', name: 'YouTube Music Browser', expectedContent: /youtube|music|browse/i },
  { path: '/youtube-music/search', name: 'YouTube Music Search', expectedContent: /search|buscar/i },
  { path: '/youtube-music/library', name: 'YouTube Music Library', expectedContent: /library|biblioteca/i },
  { path: '/youtube-music/playlist', name: 'YouTube Music Playlist', expectedContent: /playlist/i },
];

const dashboardRoutes = [
  { path: '/dashboard', name: 'Dashboard', requiresAuth: true },
  { path: '/dashboard/health', name: 'Health Dashboard', requiresAuth: true },
  { path: '/dashboard/github', name: 'GitHub Dashboard', requiresAuth: true },
  { path: '/dashboard/kiosk', name: 'Kiosk Monitor', requiresAuth: true },
  { path: '/dashboard/clients', name: 'Clients Monitor', requiresAuth: true },
  { path: '/dashboard/stats', name: 'Jukebox Stats', requiresAuth: true },
  { path: '/dashboard/a11y', name: 'Accessibility Dashboard', requiresAuth: true },
];

const protectedRoutes = [
  { path: '/settings', name: 'Settings', requiresAuth: true },
  { path: '/admin', name: 'Admin', requiresAuth: true },
  { path: '/admin/logs', name: 'Admin Logs', requiresAuth: true },
  { path: '/admin/feedback', name: 'Admin Feedback', requiresAuth: true },
  { path: '/admin/library', name: 'Admin Library', requiresAuth: true },
];

// ============================================================================
// Test Suites
// ============================================================================

test.describe('Route Validation - Public Routes', () => {
  for (const route of publicRoutes) {
    test(`${route.name} (${route.path}) should load successfully`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      
      // Should return successful HTTP status
      expect(response?.status()).toBeLessThan(400);
      
      // Should not redirect to 404
      await expect(page).not.toHaveURL(/not-found|404/i);
      
      // Should have expected content
      if (route.expectedContent) {
        await expect(page.locator('body')).toContainText(route.expectedContent, { timeout: 10000 });
      }
    });
  }
});

test.describe('Route Validation - Spotify Integration', () => {
  for (const route of spotifyRoutes) {
    test(`${route.name} (${route.path}) should load`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      
      expect(response?.status()).toBeLessThan(400);
      await expect(page).not.toHaveURL(/not-found|404/i);
    });
  }
});

test.describe('Route Validation - YouTube Music Integration', () => {
  for (const route of youtubeRoutes) {
    test(`${route.name} (${route.path}) should load`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      
      expect(response?.status()).toBeLessThan(400);
      await expect(page).not.toHaveURL(/not-found|404/i);
    });
  }
});

test.describe('Route Validation - Dashboard Routes', () => {
  for (const route of dashboardRoutes) {
    test(`${route.name} (${route.path}) should redirect unauthenticated users`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      
      // Should redirect to auth or show access denied for protected routes
      const currentUrl = page.url();
      const isAuthRedirect = /auth|login|sign-in|access-denied/i.test(currentUrl);
      const hasAuthContent = await page.locator('text=/login|sign in|access denied|entrar/i').count() > 0;
      
      expect(isAuthRedirect || hasAuthContent).toBeTruthy();
    });
  }
});

test.describe('Route Validation - Protected Routes', () => {
  for (const route of protectedRoutes) {
    test(`${route.name} (${route.path}) should require authentication`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      
      const currentUrl = page.url();
      const isAuthRedirect = /auth|login|sign-in|access-denied/i.test(currentUrl);
      const hasAuthContent = await page.locator('text=/login|sign in|access denied|entrar/i').count() > 0;
      
      expect(isAuthRedirect || hasAuthContent).toBeTruthy();
    });
  }
});

test.describe('Route Validation - 404 Handling', () => {
  test('should display 404 page for invalid routes', async ({ page }) => {
    await page.goto('/this-route-definitely-does-not-exist-xyz-123', { waitUntil: 'domcontentloaded' });
    
    // Should show 404 content
    const has404Content = await page.locator('text=/404|not found|página não encontrada|voltar/i').count() > 0;
    expect(has404Content).toBeTruthy();
  });

  test('should display 404 for nested invalid routes', async ({ page }) => {
    await page.goto('/admin/invalid-nested-route-abc', { waitUntil: 'domcontentloaded' });
    
    const has404OrAuth = await page.locator('text=/404|not found|login|sign in|access denied/i').count() > 0;
    expect(has404OrAuth).toBeTruthy();
  });
});

test.describe('Route Validation - Navigation', () => {
  test('should navigate between public routes without errors', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Navigate to help
    await page.goto('/help');
    await expect(page).toHaveURL('/help');
    
    // Navigate to wiki
    await page.goto('/wiki');
    await expect(page).toHaveURL('/wiki');
    
    // No console errors should occur
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Give time for any async errors
    await page.waitForTimeout(1000);
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(
      err => !err.includes('favicon') && !err.includes('manifest')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/');
    await page.goto('/help');
    await page.goto('/wiki');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/help');
    
    // Go back again
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('/help');
  });
});

test.describe('Route Validation - Performance', () => {
  test('public routes should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('help page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/help', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });
});
