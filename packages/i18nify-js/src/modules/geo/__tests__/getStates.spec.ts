import { test } from '@playwright/test';
import getStates from '../getStates';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getStates', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getStates', getStates);
  });

  test('should print the correct state name for a country code', async ({
    page,
  }) => {
    await injectScript(page, `await getStates('IN').then(res => res.DL.name)`);

    await assertScriptText(page, 'Delhi');
  });
});
