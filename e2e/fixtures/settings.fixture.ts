import { Page, Locator, expect } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  
  // Spotify section locators
  readonly spotifySection: Locator;
  readonly spotifyWizardButton: Locator;
  readonly spotifyClientIdInput: Locator;
  readonly spotifyClientSecretInput: Locator;
  readonly spotifyConnectButton: Locator;
  readonly spotifyDisconnectButton: Locator;
  
  // YouTube Music section locators
  readonly youtubeMusicSection: Locator;
  readonly youtubeMusicWizardButton: Locator;
  readonly youtubeMusicClientIdInput: Locator;
  readonly youtubeMusicClientSecretInput: Locator;
  readonly youtubeMusicConnectButton: Locator;
  readonly youtubeMusicDisconnectButton: Locator;
  
  // Wizard dialog locators
  readonly wizardDialog: Locator;
  readonly wizardNextButton: Locator;
  readonly wizardBackButton: Locator;
  readonly wizardCancelButton: Locator;
  readonly wizardFinishButton: Locator;
  readonly wizardProgressBar: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Spotify
    this.spotifySection = page.locator('.card-dark-neon-border').filter({ hasText: 'Spotify' }).first();
    this.spotifyWizardButton = this.spotifySection.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    this.spotifyClientIdInput = this.spotifySection.getByLabel(/Client ID/i);
    this.spotifyClientSecretInput = this.spotifySection.getByLabel(/Client Secret/i);
    this.spotifyConnectButton = this.spotifySection.getByRole('button', { name: /Conectar com Spotify/i });
    this.spotifyDisconnectButton = this.spotifySection.getByRole('button', { name: /Desconectar/i });
    
    // YouTube Music
    this.youtubeMusicSection = page.locator('.card-dark-neon-border').filter({ hasText: 'YouTube Music' });
    this.youtubeMusicWizardButton = this.youtubeMusicSection.getByRole('button', { name: /Configurar com Assistente Guiado/i });
    this.youtubeMusicClientIdInput = this.youtubeMusicSection.getByLabel(/Client ID/i);
    this.youtubeMusicClientSecretInput = this.youtubeMusicSection.getByLabel(/Client Secret/i);
    this.youtubeMusicConnectButton = this.youtubeMusicSection.getByRole('button', { name: /Conectar com Google/i });
    this.youtubeMusicDisconnectButton = this.youtubeMusicSection.getByRole('button', { name: /Desconectar/i });
    
    // Wizard dialog
    this.wizardDialog = page.getByRole('dialog');
    this.wizardNextButton = this.wizardDialog.getByRole('button', { name: /Próximo/i });
    this.wizardBackButton = this.wizardDialog.getByRole('button', { name: /Voltar/i });
    this.wizardCancelButton = this.wizardDialog.getByRole('button', { name: /Cancelar/i });
    this.wizardFinishButton = this.wizardDialog.getByRole('button', { name: /Finalizar/i });
    this.wizardProgressBar = this.wizardDialog.locator('[role="progressbar"]');
  }

  async goto() {
    await this.page.goto('/settings');
    await this.page.waitForLoadState('networkidle');
  }

  async openSpotifyWizard() {
    const isVisible = await this.spotifyWizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      throw new Error('Spotify wizard button not visible - may already be connected');
    }
    await this.spotifyWizardButton.click();
    await expect(this.wizardDialog).toBeVisible();
  }

  async openYouTubeMusicWizard() {
    const isVisible = await this.youtubeMusicWizardButton.isVisible().catch(() => false);
    if (!isVisible) {
      throw new Error('YouTube Music wizard button not visible - may already be connected');
    }
    await this.youtubeMusicWizardButton.click();
    await expect(this.wizardDialog).toBeVisible();
  }

  async fillSpotifyCredentials(clientId: string, clientSecret: string) {
    await this.spotifyClientIdInput.fill(clientId);
    await this.spotifyClientSecretInput.fill(clientSecret);
  }

  async fillYouTubeMusicCredentials(clientId: string, clientSecret: string) {
    await this.youtubeMusicClientIdInput.fill(clientId);
    await this.youtubeMusicClientSecretInput.fill(clientSecret);
  }

  async navigateWizardToStep(targetStep: number, checkboxLabels: string[] = []) {
    for (let i = 0; i < targetStep; i++) {
      // Check any required checkbox for current step
      if (checkboxLabels[i]) {
        const checkbox = this.wizardDialog.getByLabel(new RegExp(checkboxLabels[i], 'i'));
        await checkbox.check();
      }
      await this.wizardNextButton.click();
    }
  }

  async completeSpotifyWizard(clientId: string, clientSecret: string) {
    await this.openSpotifyWizard();
    
    const checkboxes = [
      '', // Step 1: No checkbox
      'Já estou logado', // Step 2
      'Aplicativo criado', // Step 3
      'URI adicionada', // Step 4
    ];
    
    await this.navigateWizardToStep(4, checkboxes);
    
    // Fill credentials in step 5
    await this.wizardDialog.getByLabel(/Client ID/i).fill(clientId);
    await this.wizardDialog.getByLabel(/Client Secret/i).fill(clientSecret);
    
    await this.wizardFinishButton.click();
    await expect(this.wizardDialog).not.toBeVisible();
  }

  async completeYouTubeMusicWizard(clientId: string, clientSecret: string) {
    await this.openYouTubeMusicWizard();
    
    const checkboxes = [
      '', // Step 1: No checkbox
      'Já estou logado', // Step 2
      'Projeto criado', // Step 3
      'URI', // Step 4
    ];
    
    await this.navigateWizardToStep(4, checkboxes);
    
    // Fill credentials in step 5
    await this.wizardDialog.getByLabel(/Client ID/i).fill(clientId);
    await this.wizardDialog.getByLabel(/Client Secret/i).fill(clientSecret);
    
    await this.wizardFinishButton.click();
    await expect(this.wizardDialog).not.toBeVisible();
  }

  async closeWizard() {
    await this.wizardCancelButton.click();
    await expect(this.wizardDialog).not.toBeVisible();
  }

  async isSpotifyConnected(): Promise<boolean> {
    const connectedBadge = this.spotifySection.locator('text=Conectado');
    return connectedBadge.isVisible().catch(() => false);
  }

  async isYouTubeMusicConnected(): Promise<boolean> {
    const connectedBadge = this.youtubeMusicSection.locator('text=Conectado');
    return connectedBadge.isVisible().catch(() => false);
  }
}

export async function createSettingsPage(page: Page): Promise<SettingsPage> {
  const settingsPage = new SettingsPage(page);
  await settingsPage.goto();
  return settingsPage;
}
