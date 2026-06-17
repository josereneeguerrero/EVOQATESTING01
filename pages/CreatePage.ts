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
    if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await skipBtn.click();
    }
  }
}
