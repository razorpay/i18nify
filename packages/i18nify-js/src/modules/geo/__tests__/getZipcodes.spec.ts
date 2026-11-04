import { test } from '@playwright/test';
import getZipcodes from '../getZipcodes';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getZipcodes', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getZipcodes', getZipcodes);
  });

  test('should print the correct zipcodes for provided country and state code', async ({
    page,
  }) => {
    // Assert a known zipcode is present rather than res[0]: the zipcode order in
    // the source data is not guaranteed, so an index-based check is brittle.
    // 600001 is Chennai GPO (Tamil Nadu).
    await injectScript(
      page,
      `await getZipcodes('IN', 'TN').then(res => res.includes('600001'))`,
    );

    await assertScriptText(page, 'true');
  });
});
