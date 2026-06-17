import { Page, expect } from '@playwright/test';

export class TeachAIPage {
  constructor(private page: Page) {}

  async assertModalVisible() {
    await expect(
      this.page.getByRole('heading', { name: 'Teach AI' })
    ).toBeVisible({ timeout: 15_000 });
  }

  async navigateFromSidebar() {
    await this.page.getByRole('link', { name: /teach ai/i }).click();
    await this.assertModalVisible();
  }

  async fillContext(text: string) {
    await this.page
      .getByPlaceholder(
        'Provide any additional information that AI needs to know about here'
      )
      .fill(text);
  }

  async clickAttachFile() {
    await this.page.getByText('Add file').click();
  }

  async uploadFile(absolutePath: string) {
    await this.clickAttachFile();
    await this.page.locator('input[type="file"]').setInputFiles(absolutePath);
    // Wait for the uploaded filename to appear in the file list
    const filename = absolutePath.split(/[\\/]/).pop()!;
    await expect(
      this.page.getByText(filename)
    ).toBeVisible({ timeout: 15_000 });
  }

  async clickContinue() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }
}
