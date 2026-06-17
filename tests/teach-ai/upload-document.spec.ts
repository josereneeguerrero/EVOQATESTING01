import { test, expect } from '@playwright/test';
import * as path from 'path';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { TeachAIPage } from '../../pages/TeachAIPage';
import { CreatePage } from '../../pages/CreatePage';

const FIXTURE = path.resolve(__dirname, '../../fixtures/test-document.txt');

test.describe('Teach AI — Upload document', () => {
  test('uploads a .txt document via the Teach AI dropzone', async ({ page }) => {
    const projects = new ProjectsPage(page);
    const create = new CreatePage(page);
    const teachAI = new TeachAIPage(page);

    // Create a project first so we can access Teach AI from the sidebar
    await projects.navigate();
    await projects.clickAddProject();
    await create.assertModalVisible();
    await create.selectType('AI Survey');
    await create.clickCreate('AI Survey');
    await create.skipDraftModal();

    await expect(page).toHaveURL(/\/projects\/[0-9a-f]{8}-[0-9a-f]{4}/);

    // Navigate to Teach AI from the project sidebar
    await teachAI.navigateFromSidebar();
    await teachAI.uploadFile(FIXTURE);

    await expect(page.getByText(/\d+\s*KB/i)).toBeVisible();
  });
});
