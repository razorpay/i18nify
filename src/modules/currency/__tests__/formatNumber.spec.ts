import { test } from '@playwright/test';
import formatNumber from '../formatNumber';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

const nbsp = String.fromCharCode(160);
const nnsp = String.fromCharCode(8239);

test.describe('formatNumber', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('formatNumber', formatNumber);
  });

  test('should format the amount with default options', async ({ page }) => {
    await injectScript(page, `formatNumber('1000.5', { currency: 'USD' })`);
    await assertScriptText(page, '$1,000.50');
  });

  test('should format the amount with custom locale and currency display', async ({
    page,
  }) => {
    await injectScript(
      page,
      `formatNumber('1500', {
      currency: 'EUR',
      locale: 'fr-FR',
      intlOptions: {
        currencyDisplay: 'code',
      },
    })`,
    );

    await assertScriptText(page, `1${nnsp}500,00${nbsp}EUR`);
  });

  test('should format the amount without currency symbol', async ({ page }) => {
    await injectScript(page, `formatNumber('750.75')`);
    await assertScriptText(page, '750.75');
  });

  test('should format the amount with narrow currency symbol', async ({
    page,
  }) => {
    await injectScript(
      page,
      `formatNumber('5000', {
      currency: 'JPY',
      intlOptions: {
        currencyDisplay: 'narrowSymbol',
      },
    })`,
    );
    await assertScriptText(page, '¥5,000');
  });

  test('should format a negative amount', async ({ page }) => {
    await injectScript(page, `formatNumber('-500', { currency: 'USD' })`);
    await assertScriptText(page, '-$500.00');
  });

  test('should format with custom minimum and maximum fraction digits', async ({
    page,
  }) => {
    await injectScript(
      page,
      `formatNumber('42.12345', {
      currency: 'USD',
      intlOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      },
    })`,
    );

    await assertScriptText(page, '$42.123');
  });

  test('should format with all default options', async ({ page }) => {
    await injectScript(page, `formatNumber(12345.6789)`);
    await assertScriptText(page, '12,345.679');
  });

  test('should handle custom currency symbol and placement', async ({
    page,
  }) => {
    await injectScript(
      page,
      `formatNumber('1000', {
    currency: 'XYZ',
    intlOptions: {
      style: 'currency',
      currencyDisplay: 'symbol',
      currencySign: 'accounting',
    },
  })`,
    );
    const expected = `XYZ${nbsp}1,000.00`;
    await assertScriptText(page, expected);
  });
});
