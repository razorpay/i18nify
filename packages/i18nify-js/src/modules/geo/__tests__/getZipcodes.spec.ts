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
    await injectScript(
      page,
      `await getZipcodes('IN', 'TN').then(res => res[0])`,
    );

    await assertScriptText(page, '124508');
  });
});
