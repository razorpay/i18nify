import { test } from '@playwright/test';
import getCities from '../getCities';
import { assertScriptText, injectScript } from '../../../blackbox/utils';
import { CountryDetailType } from '../types';
import { INDIA_DATA } from '../mocks/country';

test.describe('getCities', () => {
  test.beforeEach(async ({ page }) => {
    global.fetch = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve<CountryDetailType>(INDIA_DATA),
      } as Response);

    await page.exposeFunction('getCities', getCities);
  });

  test('should print the correct city name for provided country and state code', async ({
    page,
  }) => {
    await injectScript(page, `await getCities('IN', 'DL').then(res => res[0])`);

    await assertScriptText(page, 'East Delhi');
  });
});
