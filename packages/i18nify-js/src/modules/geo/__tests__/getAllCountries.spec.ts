import { test } from '@playwright/test';
import getAllCountries from '../getAllCountries';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getAllCountries', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getAllCountries', getAllCountries);
  });

  test('should print the correct country name from countries meta data', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getAllCountries().then(res => res.IN.country_name)`,
    );

    await assertScriptText(page, 'India');
  });
});
