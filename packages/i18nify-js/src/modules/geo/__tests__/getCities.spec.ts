import { test } from '@playwright/test';
import getCities from '../getCities';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getCities', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getCities', getCities);
  });

  test('should print the correct city name for provided country and state code', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getCities('IN', 'DL').then(res => String(Array.isArray(res) && res.length > 0 && typeof res[0] === 'string'))`,
    );

    await assertScriptText(page, 'true');
  });
});
