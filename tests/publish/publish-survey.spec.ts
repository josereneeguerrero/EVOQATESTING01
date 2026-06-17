import { test, expect } from '@playwright/test';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { CreatePage } from '../../pages/CreatePage';
import { PublishPage } from '../../pages/PublishPage';

test.describe('Publish project and take survey', () => {
  test('publishes a project and the survey URL loads for respondents', async ({ page }) => {
    const projects = new ProjectsPage(page);
    const create = new CreatePage(page);
    const publish = new PublishPage(page);

    // Create a fresh project
    await projects.navigate();
    await projects.clickAddProject();
    await create.assertModalVisible();
    await create.selectType('AI Survey');
    await create.clickCreate('AI Survey');
    await create.skipDraftModal();

    // /projects/new has Settings tab disabled — go back to list and reopen with real UUID URL
    await projects.navigate();
    await projects.openFirstProject();

    // Capture project UUID from URL before publishing
    const projectId = page.url().match(/\/projects\/([0-9a-f-]{36})/)?.[1];
    expect(projectId, 'Project ID must be present in URL').toBeTruthy();

    // Publish from Settings tab
    await publish.goToSettings();
    await publish.clickPublish();
    await publish.assertPublishedModalVisible();
    await publish.clickCopyLink();
    await publish.closeModal();

    // Build survey URL from the UUID we already have — no need to read the modal DOM
    const surveyUrl = `https://evo.dev.theysaid.io/survey/project/${projectId}`;
    await page.goto(surveyUrl);

    await expect(page).toHaveURL(/\/survey\/project\//);
    await expect(
      page.locator('input[type="range"], button').first()
    ).toBeVisible({ timeout: 15_000 });

    const slider = page.locator('input[type="range"]').first();
    if (await slider.isVisible()) {
      await slider.fill('4');
    }
  });
});
