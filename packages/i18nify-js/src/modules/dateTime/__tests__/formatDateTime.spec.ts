import { test } from '@playwright/test';
import { injectScript, assertScriptText } from '../../../blackbox/utils';
import formatDateTime from '../formatDateTime';

test.describe('formatDateTime', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('formatDateTime', formatDateTime);
  });

  test('should format date and time with default options', async ({ page }) => {
    await injectScript(page, `await formatDateTime('2024-01-01T12:00:00')`);
    await assertScriptText(page, '1/1/2024');
  });

  test('should format date only', async ({ page }) => {
    await injectScript(
      page,
      `await formatDateTime('2024-03-01', {
        locale: 'en-US',
        dateTimeMode: 'dateOnly'
      })`,
    );
    await assertScriptText(page, '3/1/2024');
  });

  test('should format time only with 24-hour clock', async ({ page }) => {
    await injectScript(
      page,
      `await formatDateTime('2024-01-01T23:00:00', {
        locale: 'en-US',
        dateTimeMode: 'timeOnly',
        intlOptions: { hour12: false }
      })`,
    );
    await assertScriptText(page, '23:00:00');
  });

  test('should format with custom locale (French) and date only mode', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await formatDateTime('2024-05-15', {
        locale: 'fr-FR',
        dateTimeMode: 'dateOnly'
      })`,
    );
    await assertScriptText(page, '15/05/2024');
  });

  test('should format with custom options for a detailed time representation', async ({
    page,
  }) => {
    await injectScript(
      page,
      `await formatDateTime('2024-12-31T23:59:59', {
        locale: 'en-US',
        dateTimeMode: 'timeOnly',
        intlOptions: {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }
      })`,
    );
    await assertScriptText(page, '11:59:59 PM');
  });
});
