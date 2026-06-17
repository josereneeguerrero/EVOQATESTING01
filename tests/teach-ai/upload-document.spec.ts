import { test, expect } from '@playwright/test';
import * as path from 'path';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { TeachAIPage } from '../../pages/TeachAIPage';

const FIXTURE = path.resolve(__dirname, '../../fixtures/test-document.txt');

test.describe('Teach AI — Upload document', () => {
  test('uploads a .txt document via the Teach AI dropzone', async ({ page }) => {
    const projects = new ProjectsPage(page);
    const teachAI = new TeachAIPage(page);

    await projects.navigate();
    await projects.clickAddProject();

    await teachAI.assertModalVisible();
    await teachAI.uploadFile(FIXTURE);

    await expect(page.getByText(/\d+\s*KB/i)).toBeVisible();
  });
});
