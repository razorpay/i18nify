import { test } from '@playwright/test';
import getZipcodes from '../getZipcodes';
import { assertScriptText, injectScript } from '../../../blackbox/utils';
import { INDIA_DATA } from '../mocks/country';

const originalFetch = global.fetch;

test.describe('getZipcodes', () => {
  test.beforeEach(async ({ page }) => {
    global.fetch = async () =>
      ({
        json: async () => INDIA_DATA,
      }) as Response;
    await page.exposeFunction('getZipcodes', getZipcodes);
  });

  test.afterEach(() => {
    global.fetch = originalFetch;
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
