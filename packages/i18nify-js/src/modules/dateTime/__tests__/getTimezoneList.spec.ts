import { test } from '@playwright/test';
import { getTimezoneList } from '../index';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getTimezoneList', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getTimezoneList', getTimezoneList);
  });

  test('should print the correct timezone of a country capital from countries meta data', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getTimezoneList().then(res => res.AF.timezone_of_capital)`,
    );

    await assertScriptText(page, 'Asia/Kabul');
  });
});