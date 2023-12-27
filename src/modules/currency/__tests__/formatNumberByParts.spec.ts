import { test } from '@playwright/test';
import formatNumberByParts from '../formatNumberByParts';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

function generateByPartsString(options) {
  const methodCallStr = `(await formatNumberByParts(${options}))`;
  return `${methodCallStr}.currencySymbol + ${methodCallStr}.integerValue + ${methodCallStr}.separator + ${methodCallStr}.decimalValue`;
}

function generateOptionsString(number, options) {
  return `${number}, { currency: '${options.currency}', ${
    options.locale ? `locale: '${options.locale}'` : ''
  } }`;
}

test.describe('formatNumberByParts', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('formatNumberByParts', formatNumberByParts);
  });

  test('should format the amount correctly for a given currency', async ({
    page,
  }) => {
    await injectScript(
      page,
      generateByPartsString(
        generateOptionsString(12345.67, {
          currency: 'USD',
          locale: 'en-US',
        }),
      ),
    );

    /**
     * Since comparing objects on the rendered UI is not possible,
     * we render and compare each key in the parsed object in the final string .
     */
    await assertScriptText(page, '$12,345.67');
  });

  test('should use the default locale if locale is not provided', async ({
    page,
  }) => {
    await injectScript(
      page,
      generateByPartsString(
        generateOptionsString(12345.67, {
          currency: 'USD',
        }),
      ),
    );

    await assertScriptText(page, '$12,345.67');
  });

  test('should handle invalid currency code', async ({ page }) => {
    await injectScript(
      page,
      generateByPartsString(
        generateOptionsString(12345.67, {
          currency: 'XYZ',
        }),
      ),
    );

    await assertScriptText(page, 'XYZ12,345.67');
  });

  test('should handle different locales', async ({ page }) => {
    await injectScript(
      page,
      generateByPartsString(
        generateOptionsString(12345.67, {
          currency: 'EUR',
          locale: 'fr-FR',
        }),
      ),
    );

    await assertScriptText(page, '€12 345,67');
  });
});
