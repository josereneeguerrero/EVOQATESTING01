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
}
