import { test } from '@playwright/test';
import getZipcodes from '../getZipcodes';
import { assertScriptText, injectScript } from '../../../blackbox/utils';
import { INDIA_DATA } from '../mocks/country';

const originalFetch = global.fetch;

test.describe('getZipcodes', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getZipcodes', getZipcodes);
    global.fetch = async () =>
      ({
        json: async () => INDIA_DATA,
      }) as Response;
  });

  test.afterEach(() => {
    global.fetch = originalFetch;
  });

  test('should print the correct zipcodes for provided country and state code', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getZipcodes('IN', 'NL').then(res => res[0])`,
    );

    await assertScriptText(page, '124508');
  });
});
