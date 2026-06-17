import { Page, expect } from '@playwright/test';

export class PublishPage {
  constructor(private page: Page) {}

  async goToSettings() {
    await this.page.getByRole('tab', { name: 'Settings' }).click();
  }

  async clickPublish() {
    await this.page.getByRole('button', { name: 'Publish' }).click();
  }

  async assertPublishedModalVisible() {
    await expect(
      this.page.getByText('Your project has been published!')
    ).toBeVisible({ timeout: 15_000 });
  }

  async clickCopyLink() {
    await this.page.getByRole('button', { name: 'Copy link' }).click();
  }

  async closeModal() {
    await this.page.keyboard.press('Escape');
  }
}
