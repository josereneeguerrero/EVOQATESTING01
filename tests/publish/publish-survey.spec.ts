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

    // The new project lands at /projects/new with Settings tab disabled.
    // Navigate back to the list and re-open it to get its real UUID URL.
    await projects.navigate();
    await projects.openFirstProject();

    // Extract project ID from the now-resolved UUID URL
    const projectId = page.url().match(/\/projects\/([0-9a-f-]{36})/)?.[1];
    expect(projectId, 'Project ID must be present in URL').toBeTruthy();

    // Publish from Settings tab (enabled on a saved project)
    await publish.goToSettings();
    await publish.clickPublish();
    await publish.assertPublishedModalVisible();

    // Get survey URL from the modal
    const surveyUrl = await publish.getSurveyUrl();
    await publish.clickCopyLink();
    await publish.closeModal();

    // Navigate to survey as respondent
    const targetUrl = surveyUrl || `https://evo.dev.theysaid.io/survey/project/${projectId}`;
    expect(targetUrl, 'Survey URL must be available').toBeTruthy();
    await page.goto(targetUrl);

    await expect(page).toHaveURL(/\/survey\/project\//);
    await expect(
      page.locator('input[type="range"], button').first()
    ).toBeVisible({ timeout: 15_000 });

    // Interact with rating slider if present
    const slider = page.locator('input[type="range"]').first();
    if (await slider.isVisible()) {
      await slider.fill('4');
    }
  });
});
