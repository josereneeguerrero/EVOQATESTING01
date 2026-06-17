import { test, expect } from '@playwright/test';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { TeachAIPage } from '../../pages/TeachAIPage';
import { CreatePage } from '../../pages/CreatePage';

test.describe('Create project flow', () => {
  test('creates a new AI Survey project via the wizard', async ({ page }) => {
    const projects = new ProjectsPage(page);
    const teachAI = new TeachAIPage(page);
    const create = new CreatePage(page);

    await projects.navigate();
    await projects.clickAddProject();

    await teachAI.assertModalVisible();
    await teachAI.fillContext('Automated QA test — create project flow.');
    await teachAI.clickContinue();

    await create.assertModalVisible();
    await create.selectType('AI Survey');
    await create.clickCreate('AI Survey');
    await create.skipDraftModal();

    await expect(page).toHaveURL(/\/projects\/[0-9a-f]{8}-[0-9a-f]{4}/);
    await expect(page.getByText(/Untitled AI Survey/)).toBeVisible();
  });
});
