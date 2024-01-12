import { test } from '@playwright/test';
import formatPhoneNumber from '../formatPhoneNumber';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('formatPhoneNumber', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('formatPhoneNumber', formatPhoneNumber);
  });

  test('should format an Indian phone number', async ({ page }) => {
    await injectScript(page, `await formatPhoneNumber('+917394926646', 'IN')`);

    await assertScriptText(page, '+91 7394 926646');
  });

  test('should format a Malaysian phone number', async ({ page }) => {
    await injectScript(page, `await formatPhoneNumber('+60123456789', 'MY')`);

    await assertScriptText(page, '+60 12 34567 89');
  });

  test('should handle a invalid country code and detect it from phone number to format', async ({
    page,
  }) => {
    await injectScript(page, `await formatPhoneNumber('+917394926646', 'XYZ')`);

    await assertScriptText(page, '+91 7394 926646');
  });
});
