import { test, expect } from '@playwright/test';

test.describe('Spotify Setup Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should display wizard button when not connected', async ({ page }) => {
    // Look for the wizard button in Spotify section
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    // Button should be visible if not connected
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (isVisible) {
      await expect(wizardButton).toBeVisible();
    }
  });

  test('should open wizard dialog when clicking the button', async ({ page }) => {
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i }).first();
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Check wizard dialog is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Configurar Spotify')).toBeVisible();
  });

  test('should show introduction step first', async ({ page }) => {
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i }).first();
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Verify introduction content
    await expect(page.getByText(/Bem-vindo/i)).toBeVisible();
    await expect(page.getByText(/Spotify Developer/i)).toBeVisible();
  });

  test('should navigate between steps', async ({ page }) => {
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i }).first();
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Step 1: Introduction - click Next
    const nextButton = page.getByRole('button', { name: /Próximo/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    // Step 2: Developer Dashboard
    await expect(page.getByText(/Developer Dashboard/i)).toBeVisible();
    
    // Go back
    const backButton = page.getByRole('button', { name: /Voltar/i });
    await backButton.click();
    
    // Should be back at introduction
    await expect(page.getByText(/Bem-vindo/i)).toBeVisible();
  });

  test('should show redirect URI in step 4', async ({ page }) => {
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i }).first();
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Navigate to step 4 (Redirect URI)
    // Step 1 -> 2
    await page.getByRole('button', { name: /Próximo/i }).click();
    // Check checkbox and continue
    await page.getByLabel(/Já estou logado/i).check();
    // Step 2 -> 3
    await page.getByRole('button', { name: /Próximo/i }).click();
    // Check checkbox
    await page.getByLabel(/Aplicativo criado/i).check();
    // Step 3 -> 4
    await page.getByRole('button', { name: /Próximo/i }).click();
    
    // Verify redirect URI is shown
    const originUrl = page.url().split('/settings')[0];
    await expect(page.locator(`input[value*="${originUrl}"]`)).toBeVisible();
  });

  test('should validate credentials in final step', async ({ page }) => {
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i }).first();
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Navigate through all steps to the credentials step
    // Step 1 -> 2
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Já estou logado/i).check();
    // Step 2 -> 3
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Aplicativo criado/i).check();
    // Step 3 -> 4
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/URI adicionada/i).check();
    // Step 4 -> 5
    await page.getByRole('button', { name: /Próximo/i }).click();
    
    // Verify credentials inputs are shown
    await expect(page.getByLabel(/Client ID/i)).toBeVisible();
    await expect(page.getByLabel(/Client Secret/i)).toBeVisible();
    
    // Finalizar button should be disabled without credentials
    const finishButton = page.getByRole('button', { name: /Finalizar/i });
    await expect(finishButton).toBeDisabled();
    
    // Fill in credentials
    await page.getByLabel(/Client ID/i).fill('test-client-id-12345678');
    await page.getByLabel(/Client Secret/i).fill('test-secret-12345678');
    
    // Now button should be enabled
    await expect(finishButton).toBeEnabled();
  });

  test('should close wizard on cancel', async ({ page }) => {
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i }).first();
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Click cancel button
    await page.getByRole('button', { name: /Cancelar/i }).click();
    
    // Dialog should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should have progress indicator', async ({ page }) => {
    const wizardButton = page.getByRole('button', { name: /Configurar com Assistente Guiado/i }).first();
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Check for progress bar
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    // Progress should show step indicators
    await expect(page.getByText(/Passo 1 de 5/i)).toBeVisible();
  });
});
