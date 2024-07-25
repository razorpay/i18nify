import { test } from '@playwright/test';
import parseDateTime from '../parseDateTime';
import { assertScriptText, injectScript } from '../../../blackbox/utils';
import { DateInput, Locale } from '../types';

function generateParseDateTimeString(options: string) {
  const methodCallStr = `(await parseDateTime(${options}))`;
  return `${methodCallStr}.year + ' ' + ${methodCallStr}.month + ' ' + ${methodCallStr}.day + ' ' + ${methodCallStr}.hour + ':' + ${methodCallStr}.minute + ':' + ${methodCallStr}.second`;
}

function generateOptionsString(
  date: DateInput,
  options: { locale?: Locale; intlOptions?: Intl.DateTimeFormatOptions } = {},
) {
  const { locale, intlOptions } = options;
  const intlOptionsString = JSON.stringify(intlOptions || {});
  return `'${date}', { locale: '${
    locale || ''
  }', intlOptions: ${intlOptionsString} }`;
}

test.describe('parseDateTime', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('parseDateTime', parseDateTime);
  });

  test('parses standard date input correctly', async ({ page }) => {
    await injectScript(
      page,
      generateParseDateTimeString(
        generateOptionsString('2024-01-01', {
          intlOptions: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        }),
      ),
    );

    await assertScriptText(
      page,
      '2024 January 1 undefined:undefined:undefined',
    );
  });

  test('formats date according to specified locale', async ({ page }) => {
    await injectScript(
      page,
      generateParseDateTimeString(
        generateOptionsString('2024-01-01', {
          locale: 'de-DE',
          intlOptions: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        }),
      ),
    );

    await assertScriptText(page, '2024 Januar 1 undefined:undefined:undefined');
  });

  test('handles leap year correctly', async ({ page }) => {
    await injectScript(
      page,
      generateParseDateTimeString(generateOptionsString('2024-02-29')),
    );

    await assertScriptText(page, '2024 2 29 undefined:undefined:undefined');
  });

  test('parses time components correctly', async ({ page }) => {
    await injectScript(
      page,
      generateParseDateTimeString(
        generateOptionsString('2024-01-01T23:59:59', {
          intlOptions: {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
          },
        }),
      ),
    );

    await assertScriptText(page, 'undefined undefined undefined 23:59:59');
  });
});
