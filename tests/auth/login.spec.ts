import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login flow', () => {
  test('login page renders AuthKit form with email and OAuth options', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.assertLoaded();

    await ctx.close();
  });

  test('authenticated session accessing root redirects to /projects', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByRole('heading', { name: 'AI Projects' })).toBeVisible();
  });

  test('login page shows sign-up link for new users', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.assertSignUpLinkVisible();

    await ctx.close();
  });
});
