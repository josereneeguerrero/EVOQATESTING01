import { test, expect } from '@playwright/test';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { TeachAIPage } from '../../pages/TeachAIPage';
import { CreatePage } from '../../pages/CreatePage';
import { PublishPage } from '../../pages/PublishPage';

test.describe('Publish project and take survey', () => {
  test('publishes a project and the survey URL loads for respondents', async ({ page }) => {
    const projects = new ProjectsPage(page);
    const teachAI = new TeachAIPage(page);
    const create = new CreatePage(page);
    const publish = new PublishPage(page);

    // Create a fresh project
    await projects.navigate();
    await projects.clickAddProject();
    await teachAI.assertModalVisible();
    await teachAI.fillContext('QA automated test — publish and survey flow.');
    await teachAI.clickContinue();
    await create.assertModalVisible();
    await create.selectType('AI Survey');
    await create.clickCreate('AI Survey');
    await create.skipDraftModal();

    // Extract project ID from URL
    await expect(page).toHaveURL(/\/projects\/[0-9a-f]{8}-[0-9a-f]{4}/);
    const projectUrl = page.url();
    const projectId = projectUrl.match(/\/projects\/([0-9a-f-]{36})/)?.[1];
    expect(projectId, 'Project ID must be present in URL').toBeTruthy();

    // Publish
    await publish.goToSettings();
    await publish.clickPublish();
    await publish.assertPublishedModalVisible();
    await publish.clickCopyLink();
    await publish.closeModal();

    // Navigate to survey as respondent
    const surveyUrl = `https://evo.dev.theysaid.io/survey/project/${projectId}`;
    await page.goto(surveyUrl);

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
