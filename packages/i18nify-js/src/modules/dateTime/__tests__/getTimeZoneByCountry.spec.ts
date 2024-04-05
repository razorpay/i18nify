import { test } from '@playwright/test';
import { getTimeZoneByCountry } from '../index';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getTimeZoneByCountry', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getTimeZoneByCountry', getTimeZoneByCountry);
  });

  test('should print the correct timezone of a country capital from countries meta data', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getTimeZoneByCountry('AF').then(res => res)`,
    );

    await assertScriptText(page, 'Asia/Kabul');
  });
});