import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';
import {showSettings} from 'ep_etherpad-lite/tests/frontend-new/helper/settingsHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_author_hover', () => {
  test('plugin is loaded and exposes itself in clientVars', async ({page}) => {
    const enabled = await page.evaluate(
      () => (window as any).clientVars?.plugins?.plugins?.ep_author_hover != null);
    expect(enabled).toBe(true);
  });

  test('settings popup exposes the author-hover toggle', async ({page}) => {
    await showSettings(page);
    // The plugin renders into #mySettings via the eejsBlock_mySettings
    // hook; its checkbox is identified by id="options-author-hover".
    await expect(page.locator('#options-author-hover')).toBeAttached();
    await expect(page.locator('label[for="options-author-hover"]')).toBeAttached();
  });
});
