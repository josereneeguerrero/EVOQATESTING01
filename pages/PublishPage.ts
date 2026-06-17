import { Page, expect } from '@playwright/test';

export class PublishPage {
  constructor(private page: Page) {}

  async goToSettings() {
    const settingsTab = this.page.getByRole('tab', { name: 'Settings' });
    // Wait for the tab to be enabled — it's disabled while the project is still initializing
    await expect(settingsTab).not.toBeDisabled({ timeout: 30_000 });
    await settingsTab.click();
  }

  async clickPublish() {
    await this.page.getByRole('button', { name: 'Publish' }).click();
  }

  async assertPublishedModalVisible() {
    await expect(
      this.page.getByText('Your project has been published!')
    ).toBeVisible({ timeout: 15_000 });
  }

  async getSurveyUrl(): Promise<string> {
    const input = this.page.locator('input[value*="survey"]').first();
    if (await input.isVisible({ timeout: 5_000 }).catch(() => false)) {
      return input.inputValue();
    }
    // Fallback: read from any element containing the survey URL
    const el = this.page.locator('[href*="survey/project"]').first();
    return el.getAttribute('href').then(v => v ?? '');
  }

  async clickCopyLink() {
    await this.page.getByRole('button', { name: 'Copy link' }).click();
  }

  async closeModal() {
    await this.page.keyboard.press('Escape');
  }
}
