import { test } from '@playwright/test';
import getCurrencySymbol from '../getCurrencySymbol';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getCurrencySymbol', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getCurrencySymbol', getCurrencySymbol);
  });

  test('should return the correct symbol for a valid currency code', async ({
    page,
  }) => {
    await injectScript(page, `await getCurrencySymbol('USD')`);

    await assertScriptText(page, '$');
  });
});
