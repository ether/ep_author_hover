import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

// Inline replacement for the shared `showSettings` helper. The shared helper
// performs a regular `.click()` on the settings cog, which times out in
// CI because core's `#toolbar-overlay` div intercepts pointer events while
// the editor is focused (the same root cause that required `force:true`
// in `clearAuthorship` / the ep_align fix). The overlay is purely cosmetic,
// so dispatching the click with `force:true` is the supported workaround.
const openSettingsPopup = async (page: import('@playwright/test').Page) => {
  const settings = page.locator('#settings');
  const isShown = async () =>
    ((await settings.getAttribute('class')) || '').includes('popup-show');
  if (await isShown()) return;
  await page
    .locator("button[data-l10n-id='pad.toolbar.settings.title']")
    .click({force: true});
  await page.waitForFunction(
    () => document.querySelector('#settings')!.classList.contains('popup-show'));
};

test.describe('ep_author_hover', () => {
  test('plugin is loaded and exposes itself in clientVars', async ({page}) => {
    const enabled = await page.evaluate(
      () => (window as any).clientVars?.plugins?.plugins?.ep_author_hover != null);
    expect(enabled).toBe(true);
  });

  test('settings popup exposes the author-hover toggle', async ({page}) => {
    await openSettingsPopup(page);
    // The plugin renders into #mySettings via the eejsBlock_mySettings
    // hook; its checkbox is identified by id="options-author-hover".
    await expect(page.locator('#options-author-hover')).toBeAttached();
    await expect(page.locator('label[for="options-author-hover"]')).toBeAttached();
  });
});
