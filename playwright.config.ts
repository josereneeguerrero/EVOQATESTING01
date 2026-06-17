import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 4,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 90_000,
  use: {
    baseURL: 'https://evo.dev.theysaid.io',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
      use: { storageState: undefined },
    },
    {
      name: 'login',
      testMatch: '**/login.spec.ts',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    },
    {
      name: 'create-project',
      testMatch: '**/create-project.spec.ts',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    },
    {
      name: 'upload-document',
      testMatch: '**/upload-document.spec.ts',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    },
    {
      name: 'publish-survey',
      testMatch: '**/publish-survey.spec.ts',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    },
  ],
});
