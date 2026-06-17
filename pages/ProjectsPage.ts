import { Page, expect } from '@playwright/test';

export class ProjectsPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/projects');
    await expect(
      this.page.getByRole('heading', { name: 'AI Projects' })
    ).toBeVisible();
  }

  async clickAddProject() {
    await this.page.getByRole('button', { name: /add project/i }).click();
  }

  async openFirstProject() {
    // Click the first project row in the list to open it with its real UUID URL
    await this.page.locator('table tbody tr, [data-test="project-row"]').first().click();
    await expect(this.page).toHaveURL(/\/projects\/[0-9a-f-]{36}/);
  }
}
