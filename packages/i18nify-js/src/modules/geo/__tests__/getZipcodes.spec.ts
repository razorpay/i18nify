import { test } from '@playwright/test';
import getZipcodes from '../getZipcodes';
import { assertScriptText, injectScript } from '../../../blackbox/utils';
import { CountryDetailType } from '../types';
import { INDIA_DATA } from '../mocks/country';

test.describe('getZipcodes', () => {
  test.beforeEach(async ({ page }) => {
    global.fetch = () =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve<CountryDetailType>(INDIA_DATA),
      } as Response);

    await page.exposeFunction('getZipcodes', getZipcodes);
  });

  test('should print the correct zipcodes for provided country and state code', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getZipcodes('IN', 'DL').then(res => res[0])`,
    );

    await assertScriptText(page, '110092');
  });
});
