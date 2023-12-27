import { test } from '@playwright/test';
import parsePhoneNumber from '../parsePhoneNumber';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

function generateParseString(phoneNumber, country = '') {
  const methodCallStr = `(await parsePhoneNumber('${phoneNumber}' ${
    country ? `, '${country}'` : ''
  }))`;
  return `${methodCallStr}.countryCode + ${methodCallStr}.dialCode + ${methodCallStr}.formattedPhoneNumber + ${methodCallStr}.formatTemplate`;
}

test.describe('parsePhoneNumber', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('parsePhoneNumber', parsePhoneNumber);
  });

  test('should correctly parse a valid phone number with country code', async ({
    page,
  }) => {
    const phoneNumber = '+15853042806';
    const country = 'US';

    await injectScript(page, generateParseString(phoneNumber, country));

    /**
     * Since comparing objects on the rendered UI is not possible,
     * we render and compare each key in the parsed object in the final string .
     */
    await assertScriptText(page, 'US+1+1 585-304-2806xxx-xxx-xxxx');
  });

  test('should correctly parse a valid phone number without specifying country', async ({
    page,
  }) => {
    const phoneNumber = '+447123456789';

    await injectScript(page, generateParseString(phoneNumber));

    await assertScriptText(page, 'GB+44+44 7123 456 789xxxx xxx xxx');
  });

  test('should return unformatted number for invalid phone number', async ({
    page,
  }) => {
    const phoneNumber = '+1969123456789';

    await injectScript(page, generateParseString(phoneNumber));

    await assertScriptText(page, '+1969123456789');
  });
});
