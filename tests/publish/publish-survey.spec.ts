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

    await expect(page).toHaveURL(/\/projects\//, { timeout: 15_000 });

    // Publish from Settings tab
    await publish.goToSettings();
    await publish.clickPublish();
    await publish.assertPublishedModalVisible();

    // Get the survey URL from the published modal
    const surveyUrl = await publish.getSurveyUrl();

    await publish.clickCopyLink();
    await publish.closeModal();

    // Navigate to survey as respondent — use URL from modal if found, else build from current URL
    const targetUrl = surveyUrl || (() => {
      const match = page.url().match(/\/projects\/([0-9a-f-]{36})/);
      return match ? `https://evo.dev.theysaid.io/survey/project/${match[1]}` : '';
    })();

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
