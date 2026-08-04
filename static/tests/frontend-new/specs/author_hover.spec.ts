import {expect, test} from '@playwright/test';
import {
  getPadBody,
  getPadOuter,
  goToNewPad,
  writeToPad,
} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

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

  // The tooltip is drawn 1s after the mousemove and fades out ~1.2s later, so
  // poll for it rather than sampling at a fixed instant.
  const tooltipTextAfterHover = async (
    page: import('@playwright/test').Page,
    target: import('@playwright/test').Locator,
  ): Promise<string|null> => {
    await target.hover();
    const tooltip = (await getPadOuter(page)).locator('.authortooltip');
    for (let i = 0; i < 40; i++) {
      if (await tooltip.count()) return (await tooltip.first().innerText()).trim();
      await page.waitForTimeout(100);
    }
    return null;
  };

  test('shows a tooltip over your own writing', async ({page}) => {
    const body = await getPadBody(page);
    await writeToPad(page, 'MYTEXT');
    const mine = body.locator('span').filter({hasText: 'MYTEXT'}).first();
    expect(await tooltipTextAfterHover(page, mine)).not.toBeNull();
  });

  test('shows no tooltip over text the system author holds', async ({page}) => {
    // The default pad content is attributed to `a.etherpad-system` — nobody
    // wrote it, and core ships no author record for that id, so the lookup
    // used to fall through to "Unknown Author" (ether/etherpad#8044).
    const body = await getPadBody(page);
    const defaultText = body.locator('span.author-a-etherpadz45zsystem').first();
    await expect(defaultText).toBeAttached();
    expect(await tooltipTextAfterHover(page, defaultText)).toBeNull();
  });
});
