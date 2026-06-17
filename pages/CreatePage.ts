import { Page, expect } from '@playwright/test';

export type ProjectType = 'AI User Test' | 'AI Interview' | 'AI Survey' | 'AI Poll';

export class CreatePage {
  constructor(private page: Page) {}

  async assertModalVisible() {
    await expect(
      this.page.getByRole('heading', { name: 'Create' })
    ).toBeVisible({ timeout: 15_000 });
  }

  async selectType(type: ProjectType) {
    await this.page.getByText(type, { exact: true }).click();
  }

  async clickCreate(type: ProjectType) {
    await this.page.getByRole('button', { name: `Create ${type}` }).click();
  }

  async skipDraftModal() {
    const skipBtn = this.page.getByRole('button', { name: 'Skip' });
    try {
      await skipBtn.waitFor({ state: 'visible', timeout: 15_000 });
      await skipBtn.click();
      await skipBtn.waitFor({ state: 'hidden', timeout: 10_000 });
    } catch {
      // Modal did not appear — continue
    }
  }
}
