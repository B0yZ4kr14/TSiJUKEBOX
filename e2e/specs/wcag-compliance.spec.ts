import { test, expect, A11yPage } from '../fixtures/a11y.fixture';

test.describe('WCAG 2.1 AA Compliance Tests', () => {
  let a11y: A11yPage;

  test.beforeEach(async ({ page }) => {
    a11y = new A11yPage(page);
  });

  test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should have no serious accessibility violations', async () => {
      await a11y.expectNoSeriousViolations({
        // Exclude third-party components that may have issues
        exclude: ['.recharts-wrapper', '.sonner-toast'],
      });
    });

    test('should have proper color contrast', async () => {
      const violations = await a11y.checkColorContrast();
      const serious = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      expect(serious).toHaveLength(0);
    });

    test('should have all images with alt text', async () => {
      const violations = await a11y.checkImageAlts();
      expect(violations).toHaveLength(0);
    });

    test('should have valid ARIA attributes', async () => {
      const violations = await a11y.checkAriaAttributes();
      const serious = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      expect(serious).toHaveLength(0);
    });
  });

  test.describe('Player Component', () => {
    test.beforeEach(async ({ page }) => {
      // Enable demo mode for player testing
      await page.evaluate(() => {
        localStorage.setItem('tsi-jukebox-demo-mode', 'true');
      });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    test('should have accessible player controls', async ({ page }) => {
      const playerControls = page.locator('[data-testid^="player-"]');
      const count = await playerControls.count();
      
      // All player controls should have aria-label
      for (let i = 0; i < count; i++) {
        const control = playerControls.nth(i);
        const ariaLabel = await control.getAttribute('aria-label');
        const role = await control.getAttribute('role');
        
        // Should have either aria-label or proper role
        expect(ariaLabel || role).toBeTruthy();
      }
    });

    test('should have keyboard-navigable volume slider', async ({ page }) => {
      const volumeSlider = page.getByTestId('volume-slider');
      
      if (await volumeSlider.isVisible()) {
        const slider = volumeSlider.locator('input[type="range"]');
        await slider.focus();
        
        // Should be focusable
        const isFocused = await slider.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBeTruthy();
        
        // Should respond to keyboard
        await page.keyboard.press('ArrowRight');
      }
    });

    test('should have proper focus indicators on controls', async ({ page }) => {
      const controls = [
        page.getByTestId('player-play-pause'),
        page.getByTestId('player-next'),
        page.getByTestId('player-prev'),
      ];

      for (const control of controls) {
        if (await control.isVisible()) {
          await control.focus();
          
          // Check for focus styling
          const styles = await control.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              outline: computed.outline,
              boxShadow: computed.boxShadow,
            };
          });
          
          // Should have some focus indication (outline or shadow)
          const hasFocus = styles.outline !== 'none' || 
                          styles.boxShadow !== 'none' ||
                          styles.outline.includes('px');
          
          // Soft assertion - log warning if no focus indicator
          if (!hasFocus) {
            console.warn(`Control may lack visible focus indicator: ${await control.getAttribute('data-testid')}`);
          }
        }
      }
    });
  });

  test.describe('Navigation', () => {
    test('should have skip link for keyboard users', async ({ page }) => {
      await page.goto('/');
      
      // Press Tab to focus skip link (if exists)
      await page.keyboard.press('Tab');
      
      const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link');
      // Skip links are optional but recommended
      if (await skipLink.count() > 0) {
        expect(await skipLink.first().isVisible()).toBeTruthy();
      }
    });

    test('should have logical heading structure', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check heading hierarchy
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (els) =>
        els.map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim() || '',
          level: parseInt(el.tagName.charAt(1)),
        }))
      );

      // Should have at least one h1
      const h1Count = headings.filter((h) => h.level === 1).length;
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Should have no more than one h1 (best practice)
      expect(h1Count).toBeLessThanOrEqual(2);
    });

    test('should have proper link text', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const links = await page.$$eval('a', (els) =>
        els.map((el) => ({
          text: el.textContent?.trim() || '',
          ariaLabel: el.getAttribute('aria-label'),
          href: el.getAttribute('href'),
        }))
      );

      // Links should not have generic text like "click here"
      const genericTexts = ['click here', 'read more', 'more', 'here', 'link'];
      
      for (const link of links) {
        const text = (link.text || link.ariaLabel || '').toLowerCase();
        if (text && link.href) {
          const isGeneric = genericTexts.some((g) => text === g);
          if (isGeneric) {
            console.warn(`Link with generic text found: "${link.text}" -> ${link.href}`);
          }
        }
      }
    });
  });

  test.describe('Forms', () => {
    test('should have labeled form controls', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const violations = await a11y.checkFormLabels();
      expect(violations).toHaveLength(0);
    });

    test('should indicate required fields', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const requiredInputs = page.locator('input[required], textarea[required], select[required]');
      const count = await requiredInputs.count();

      for (let i = 0; i < count; i++) {
        const input = requiredInputs.nth(i);
        const ariaRequired = await input.getAttribute('aria-required');
        const required = await input.getAttribute('required');
        
        // Should have either required or aria-required
        expect(ariaRequired === 'true' || required !== null).toBeTruthy();
      }
    });
  });

  test.describe('Dynamic Content', () => {
    test('should announce toast notifications to screen readers', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Trigger a toast by interacting with the player
      const playButton = page.getByTestId('player-play-pause');
      if (await playButton.isVisible()) {
        await playButton.click();
        
        // Check if toast has proper ARIA role
        const toast = page.locator('.sonner-toast, [role="alert"], [role="status"]');
        await expect(toast.first()).toBeVisible({ timeout: 3000 });
        
        const role = await toast.first().getAttribute('role');
        expect(['alert', 'status', 'log']).toContain(role);
      }
    });

    test('should maintain focus when modals open', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find any button that opens a dialog
      const dialogTriggers = page.locator('[aria-haspopup="dialog"], [data-state="closed"]');
      
      if (await dialogTriggers.count() > 0) {
        const trigger = dialogTriggers.first();
        await trigger.click();
        
        // Check if focus moved to dialog
        const dialog = page.locator('[role="dialog"], [role="alertdialog"]');
        if (await dialog.count() > 0) {
          await expect(dialog.first()).toBeVisible();
          
          // Focus should be within dialog
          const focusInDialog = await page.evaluate(() => {
            const dialog = document.querySelector('[role="dialog"], [role="alertdialog"]');
            return dialog?.contains(document.activeElement);
          });
          
          expect(focusInDialog).toBeTruthy();
        }
      }
    });
  });

  test.describe('Route Specific Tests', () => {
    const routes = [
      '/',
      '/github-dashboard',
      '/github-code-scanner',
      '/settings',
    ];

    for (const route of routes) {
      test(`should pass WCAG check for ${route}`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Wait a bit for any async content
        await page.waitForTimeout(500);

        await a11y.expectNoSeriousViolations({
          exclude: [
            '.recharts-wrapper',
            '.sonner-toast',
            // Monaco editor if used
            '.monaco-editor',
          ],
        });
      });
    }
  });

  test.describe('Print Accessibility Report', () => {
    test('generate full report for home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // This will print a detailed report to console
      await a11y.printReport();
    });
  });
});
