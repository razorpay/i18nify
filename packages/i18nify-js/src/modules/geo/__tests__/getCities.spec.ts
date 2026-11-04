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
    // Assert a known city is present rather than res[0]: the city order in the
    // source data is not guaranteed, so an index-based check is brittle.
    await injectScript(
      page,
      `await getCities('IN', 'DL').then(res => res.includes('New Delhi'))`,
    );

    await assertScriptText(page, 'true');
  });
});
