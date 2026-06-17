import { test, expect } from '@playwright/test';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { CreatePage } from '../../pages/CreatePage';

test.describe('Create project flow', () => {
  test('creates a new AI Survey project via the wizard', async ({ page }) => {
    const projects = new ProjectsPage(page);
    const create = new CreatePage(page);

    await projects.navigate();
    await projects.clickAddProject();

    await create.assertModalVisible();
    await create.selectType('AI Survey');
    await create.clickCreate('AI Survey');
    await create.skipDraftModal();

    // App lands on the project editor (may be /projects/new or /projects/{uuid})
    await expect(page).toHaveURL(/\/projects\//, { timeout: 15_000 });
    await expect(page.getByText(/Untitled AI Survey/i)).toBeVisible();
  });
});
