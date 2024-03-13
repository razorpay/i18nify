import { test } from '@playwright/test';
import getWeekdays from '../getWeekdays';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('getWeekdays', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getWeekdays', getWeekdays);
  });

  test('should return long format weekdays for en-US locale by default', async ({
    page,
  }) => {
    await injectScript(page, `await getWeekdays({ locale: 'en-US' })`);
    await assertScriptText(
      page,
      'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
    );
  });

  // Testing short format for 'en-US' locale
  test('should return short format weekdays for en-US locale', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getWeekdays({ locale: 'en-US', weekday: 'short' })`,
    );
    await assertScriptText(page, 'Sun,Mon,Tue,Wed,Thu,Fri,Sat');
  });

  // Testing narrow format for 'fr-FR' locale
  test('should return narrow format weekdays for fr-FR locale', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await getWeekdays({ locale: 'fr-FR', weekday: 'narrow' })`,
    );
    await assertScriptText(page, 'D,L,M,M,J,V,S');
  });
});
