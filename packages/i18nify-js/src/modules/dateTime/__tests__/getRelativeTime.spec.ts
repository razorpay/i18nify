import { test } from '@playwright/test';
import { injectScript, assertScriptText } from '../../../blackbox/utils';
import getRelativeTime from '../getRelativeTime';

test.describe('getRelativeTime E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('getRelativeTime', getRelativeTime);
  });

  test('formats seconds correctly', async ({ page }) => {
    // Example test for formatting seconds
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 30 * 1000));`,
    );
    await assertScriptText(page, '30 seconds ago');
  });

  // Example test for formatting minutes
  test('formats minutes correctly', async ({ page }) => {
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 5 * 60 * 1000));`,
    );
    await assertScriptText(page, '5 minutes ago');
  });

  // Formatting hours
  test('formats hours correctly', async ({ page }) => {
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000));`,
    );
    await assertScriptText(page, '2 hours ago');
  });

  // Formatting days
  test('formats days correctly', async ({ page }) => {
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));`,
    );
    await assertScriptText(page, '3 days ago');
  });

  // Formatting weeks
  test('formats weeks correctly', async ({ page }) => {
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000));`,
    );
    await assertScriptText(page, '2 weeks ago');
  });

  // Formatting months
  test('formats months correctly', async ({ page }) => {
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000));`,
    );
    await assertScriptText(page, '3 months ago');
  });

  // Formatting years
  test('formats years correctly', async ({ page }) => {
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));`,
    );
    await assertScriptText(page, '1 year ago');
  });

  // Handling different locales
  test('handles different locales correctly', async ({ page }) => {
    await injectScript(
      page,
      `await getRelativeTime(new Date(Date.now() - 24 * 60 * 60 * 1000), { locale: 'fr-FR' });`,
    );
    await assertScriptText(page, 'il y a 1 jour');
  });
});
