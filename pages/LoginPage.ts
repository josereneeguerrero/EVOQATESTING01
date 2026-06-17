import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForURL(/authkit/, { timeout: 15_000 });
  }

  async assertLoaded() {
    await expect(this.page.locator('input[type="email"]')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await expect(this.page.locator('a[data-method="google"]')).toBeVisible();
    await expect(this.page.locator('a[data-method="linkedin"]')).toBeVisible();
  }

  async assertSignUpLinkVisible() {
    await expect(this.page.getByText("Don't have an account?")).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  }
}
