import { test } from '@playwright/test';
import { formatNumber } from '../../lib/esm';
import { assertScriptText, injectScript } from '../utils';

test('formatNumber with default params', async ({ page }) => {
  await page.exposeFunction('formatNumber', formatNumber);

  await injectScript(page, 'formatNumber(2000000)');

  await assertScriptText(page, '20,00,000');
});

test('formatNumber with INR currency', async ({ page }) => {
  await page.exposeFunction('formatNumber', formatNumber);

  await injectScript(page, 'formatNumber(2000000, { currency: "INR"})');

  await assertScriptText(page, '₹20,00,000.00');
});

test('formatNumber with USD currency and en-US locale', async ({ page }) => {
  await page.exposeFunction('formatNumber', formatNumber);

  await injectScript(
    page,
    'formatNumber(2000000, { currency: "USD", locale: "en-US"})',
  );

  await assertScriptText(page, '$2,000,000.00');
});
