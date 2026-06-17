import { test as setup } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('save authenticated session', async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email) throw new Error('Set TEST_EMAIL in your .env file before running setup');
  if (!password) throw new Error('Set TEST_PASSWORD in your .env file before running setup');

  await page.goto('/login');
  await page.waitForURL(/authkit/, { timeout: 15_000 });

  await page.fill('input[type="email"]', email);
  await page.click('button[type="submit"]');

  // AuthKit may show a password page instead of OTP
  await page.waitForURL(/\/(password|code)/, { timeout: 15_000 });

  if (page.url().includes('/password')) {
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
  } else {
    console.log('\n================================================');
    console.log('>>> Check your email and enter the OTP code <<<');
    console.log('================================================\n');
  }

  await page.waitForURL('**/projects', { timeout: 180_000 });

  await page.context().storageState({ path: authFile });
  console.log(`\nAuth session saved to ${authFile}`);
});
