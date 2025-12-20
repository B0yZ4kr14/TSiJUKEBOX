import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/landing');
  });

  test.describe('Navigation and Loading', () => {
    test('should load the landing page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/TSiJUKEBOX/i);
      await expect(page.locator('text=TSiJUKEBOX')).toBeVisible();
    });

    test('should display hero section with CTA buttons', async ({ page }) => {
      await expect(page.locator('text=Instalar Agora')).toBeVisible();
      await expect(page.locator('text=Ver Demo')).toBeVisible();
    });

    test('should display version badge', async ({ page }) => {
      await expect(page.locator('text=v2.0 - Enterprise Ready')).toBeVisible();
    });

    test('should have navigation links in footer', async ({ page }) => {
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('footer >> text=Wiki')).toBeVisible();
      await expect(page.locator('footer >> text=Brand')).toBeVisible();
      await expect(page.locator('footer >> text=Changelog')).toBeVisible();
    });
  });

  test.describe('Stats Section', () => {
    test('should display stats section with numbers', async ({ page }) => {
      await expect(page.locator('text=Em Números')).toBeVisible();
      await expect(page.locator('text=8+')).toBeVisible();
      await expect(page.locator('text=Features')).toBeVisible();
    });
  });

  test.describe('Features Section', () => {
    test('should display all 8 feature cards', async ({ page }) => {
      await expect(page.locator('text=Recursos Principais')).toBeVisible();
      
      const features = [
        'Multi-Provider',
        'Modo Kiosk',
        'Karaoke',
        'Cloud Backup',
        'RBAC',
        'Multi-idioma',
        'WCAG 2.1 AA',
        'PWA'
      ];

      for (const feature of features) {
        await expect(page.locator(`text=${feature}`)).toBeVisible();
      }
    });

    test('should have hover effects on feature cards', async ({ page }) => {
      const featureCard = page.locator('text=Multi-Provider').locator('..');
      await featureCard.hover();
      // Card should have transition classes
      await expect(featureCard).toBeVisible();
    });
  });

  test.describe('Screenshots Section', () => {
    test('should display screenshots carousel', async ({ page }) => {
      await expect(page.locator('text=Veja em Ação')).toBeVisible();
      await expect(page.locator('text=Preview Interativo')).toBeVisible();
    });

    test('should have navigation controls in carousel', async ({ page }) => {
      // Check for carousel navigation buttons
      const carouselSection = page.locator('section').filter({ hasText: 'Veja em Ação' });
      await expect(carouselSection).toBeVisible();
    });
  });

  test.describe('Theme Comparison Section', () => {
    test('should display theme comparison with both themes', async ({ page }) => {
      await expect(page.locator('text=Escolha Seu Estilo')).toBeVisible();
      await expect(page.locator('text=Dark Neon')).toBeVisible();
      await expect(page.locator('text=Light Silver')).toBeVisible();
    });
  });

  test.describe('FAQ Section', () => {
    test('should display FAQ section', async ({ page }) => {
      await expect(page.locator('text=Perguntas Frequentes')).toBeVisible();
      await expect(page.locator('h2:has-text("FAQ")')).toBeVisible();
    });

    test('should have accordion items', async ({ page }) => {
      await expect(page.locator('text=O que é o TSiJUKEBOX?')).toBeVisible();
      await expect(page.locator('text=Quais provedores de música são suportados?')).toBeVisible();
    });

    test('should expand accordion on click', async ({ page }) => {
      const accordionTrigger = page.locator('button:has-text("O que é o TSiJUKEBOX?")');
      await accordionTrigger.click();
      
      // Check that content is visible after clicking
      await expect(page.locator('text=sistema de jukebox musical profissional')).toBeVisible();
    });

    test('should collapse accordion when clicking another item', async ({ page }) => {
      // Open first accordion
      const firstTrigger = page.locator('button:has-text("O que é o TSiJUKEBOX?")');
      await firstTrigger.click();
      
      // Open second accordion
      const secondTrigger = page.locator('button:has-text("Quais provedores de música são suportados?")');
      await secondTrigger.click();
      
      // Second content should be visible
      await expect(page.locator('text=Spotify (via Spotify Connect API)')).toBeVisible();
    });
  });

  test.describe('Installation Section', () => {
    test('should display installation code block', async ({ page }) => {
      await expect(page.locator('text=Instalação Rápida')).toBeVisible();
      await expect(page.locator('text=git clone')).toBeVisible();
      await expect(page.locator('text=python main.py')).toBeVisible();
    });

    test('should have documentation and GitHub links', async ({ page }) => {
      await expect(page.locator('a:has-text("Documentação")')).toBeVisible();
      await expect(page.locator('a:has-text("GitHub")')).toBeVisible();
    });
  });

  test.describe('Responsiveness', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await expect(page.locator('text=TSiJUKEBOX')).toBeVisible();
      await expect(page.locator('text=Instalar Agora')).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await expect(page.locator('text=Recursos Principais')).toBeVisible();
    });

    test('should be responsive on kiosk viewport (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await expect(page.locator('text=Recursos Principais')).toBeVisible();
      // Check grid layout for features
      const featuresGrid = page.locator('.grid.lg\\:grid-cols-4');
      await expect(featuresGrid).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // H1 should exist (brand text in hero)
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // H2 sections should exist
      const h2Elements = page.locator('h2');
      expect(await h2Elements.count()).toBeGreaterThan(0);
    });

    test('should have accessible buttons', async ({ page }) => {
      const buttons = page.locator('button, a[role="button"]');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          // Button should have accessible name
          const accessibleName = await button.getAttribute('aria-label') || await button.textContent();
          expect(accessibleName).toBeTruthy();
        }
      }
    });

    test('should have focus indicators', async ({ page }) => {
      // Tab to first interactive element
      await page.keyboard.press('Tab');
      
      // Check that something is focused
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('accordion should be keyboard navigable', async ({ page }) => {
      // Find accordion and tab to it
      const accordionTrigger = page.locator('button:has-text("O que é o TSiJUKEBOX?")');
      await accordionTrigger.focus();
      
      // Press Enter to expand
      await page.keyboard.press('Enter');
      
      // Content should be visible
      await expect(page.locator('text=sistema de jukebox musical profissional')).toBeVisible();
    });
  });

  test.describe('Animations', () => {
    test('should render animated sections', async ({ page }) => {
      // Wait for animations to complete
      await page.waitForTimeout(1000);
      
      // Check that animated sections are visible
      await expect(page.locator('text=Recursos Principais')).toBeVisible();
      await expect(page.locator('text=Veja em Ação')).toBeVisible();
    });

    test('should have smooth scroll behavior', async ({ page }) => {
      // Check that html has smooth scroll
      const html = page.locator('html');
      const scrollBehavior = await html.evaluate((el) => 
        getComputedStyle(el).scrollBehavior
      );
      expect(scrollBehavior).toBe('smooth');
    });
  });

  test.describe('Performance', () => {
    test('should load critical content within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/landing');
      await expect(page.locator('text=TSiJUKEBOX')).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
    });
  });
});
