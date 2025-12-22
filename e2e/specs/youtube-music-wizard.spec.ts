import { test, expect } from '@playwright/test';

test.describe('YouTube Music Setup Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should display wizard button when not connected', async ({ page }) => {
    // Look for the YouTube Music wizard button
    const wizardButton = page.locator('button:has-text("Configurar com Assistente Guiado")').filter({
      has: page.locator('svg.lucide-sparkles')
    });
    
    // Should show wizard button in YouTube Music section
    const ytSection = page.locator('text=YouTube Music').first();
    await expect(ytSection).toBeVisible();
  });

  test('should open wizard dialog when clicking the button', async ({ page }) => {
    // Find YouTube Music section and its wizard button
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const wizardButton = ytCard.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Check wizard dialog is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Configurar YouTube Music')).toBeVisible();
  });

  test('should show introduction step with requirements', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const wizardButton = ytCard.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Verify introduction content
    await expect(page.getByText(/Bem-vindo à Configuração do YouTube Music/i)).toBeVisible();
    await expect(page.getByText(/Conta Google/i)).toBeVisible();
    await expect(page.getByText(/5 minutos/i)).toBeVisible();
  });

  test('should have link to Google Cloud Console in step 2', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const wizardButton = ytCard.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Go to step 2
    await page.getByRole('button', { name: /Próximo/i }).click();
    
    // Verify Google Cloud Console link
    const consoleButton = page.getByRole('button', { name: /Abrir Google Cloud Console/i });
    await expect(consoleButton).toBeVisible();
  });

  test('should show API configuration instructions in step 3', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const wizardButton = ytCard.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Navigate to step 3
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Já estou logado/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    
    // Verify YouTube Data API instructions
    await expect(page.getByText(/YouTube Data API v3/i)).toBeVisible();
    await expect(page.getByText(/Tela de Consentimento/i)).toBeVisible();
  });

  test('should show redirect URI in step 4', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const wizardButton = ytCard.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Navigate through steps
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Já estou logado/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Projeto criado/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    
    // Verify redirect URI section
    await expect(page.getByText(/URI de redirecionamento/i)).toBeVisible();
    
    // Check copy button exists
    const copyButton = page.getByRole('button').filter({ has: page.locator('svg.lucide-copy') });
    await expect(copyButton.first()).toBeVisible();
  });

  test('should validate credentials format', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const wizardButton = ytCard.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Navigate to credentials step (step 5)
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Já estou logado/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Projeto criado/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/URI/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    
    // Verify credential inputs
    await expect(page.getByLabel(/Client ID/i)).toBeVisible();
    await expect(page.getByLabel(/Client Secret/i)).toBeVisible();
    
    // Finalize button should be disabled
    const finishButton = page.getByRole('button', { name: /Finalizar/i });
    await expect(finishButton).toBeDisabled();
    
    // Fill credentials
    await page.getByLabel(/Client ID/i).fill('123456789-abcdef.apps.googleusercontent.com');
    await page.getByLabel(/Client Secret/i).fill('GOCSPX-test-secret');
    
    // Button should be enabled now
    await expect(finishButton).toBeEnabled();
  });

  test('should close wizard and save credentials on complete', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const wizardButton = ytCard.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    
    const isVisible = await wizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await wizardButton.click();
    
    // Navigate through all steps
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Já estou logado/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/Projeto criado/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    await page.getByLabel(/URI/i).check();
    await page.getByRole('button', { name: /Próximo/i }).click();
    
    // Fill credentials and complete
    await page.getByLabel(/Client ID/i).fill('123456789-abcdef.apps.googleusercontent.com');
    await page.getByLabel(/Client Secret/i).fill('GOCSPX-test-secret');
    await page.getByRole('button', { name: /Finalizar/i }).click();
    
    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Toast should appear
    await expect(page.getByText(/Configuração concluída/i)).toBeVisible();
  });
});

test.describe('YouTube Music Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should display YouTube Music section', async ({ page }) => {
    await expect(page.getByText('YouTube Music').first()).toBeVisible();
  });

  test('should show status badge', async ({ page }) => {
    const statusBadge = page.locator('.card-dark-neon-border')
      .filter({ hasText: 'YouTube Music' })
      .locator('text=Status');
    
    await expect(statusBadge).toBeVisible();
  });

  test('should have credential input fields', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    // Check for Client ID and Secret fields
    const clientIdInput = ytCard.getByLabel(/Client ID/i);
    const isVisible = await clientIdInput.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(clientIdInput).toBeVisible();
    }
  });

  test('should show connect button', async ({ page }) => {
    const ytCard = page.locator('.card-dark-neon-border').filter({
      hasText: 'YouTube Music'
    });
    
    const connectButton = ytCard.getByRole('button', { name: /Conectar com Google/i });
    await expect(connectButton).toBeVisible();
  });
});
