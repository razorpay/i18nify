import { test } from '@playwright/test';
import getCities from '../getCities';
import { assertScriptText, injectScript } from '../../../blackbox/utils';
import { INDIA_DATA } from '../mocks/country';

const originalFetch = global.fetch;

test.describe('getCities', () => {
  test.beforeEach(async ({ page }) => {
    global.fetch = async () =>
      ({
        json: async () => INDIA_DATA,
      }) as Response;
    await page.exposeFunction('getCities', getCities);
  });

  test.afterEach(() => {
    global.fetch = originalFetch;
  });

  test('should print the correct city name for provided country and state code', async ({
    page,
  }) => {
    await injectScript(page, `await getCities('IN', 'DL').then(res => res[0])`);

    await assertScriptText(page, 'East Delhi');
  });
});
