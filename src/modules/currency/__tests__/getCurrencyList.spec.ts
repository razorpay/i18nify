import { test } from '@playwright/test';
import getCurrencyList from '../getCurrencyList';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getCurrencyList', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getCurrencyList', getCurrencyList);
  });

  test('should print symbol correctly for a given currency', async ({
    page,
  }) => {
    await injectScript(page, `(await getCurrencyList())['USD'].symbol`);

    await assertScriptText(page, '$');
  });

  test('should print name correctly for a given currency', async ({ page }) => {
    await injectScript(page, `(await getCurrencyList())['USD'].name`);

    await assertScriptText(page, 'United States Dollar');
  });
});
