import { test } from '@playwright/test';
import isValidPhoneNumber from '../isValidPhoneNumber';
import { assertScriptText, injectScript } from '../../../blackbox/utils';

test.describe('isValidPhoneNumber', () => {
  test.beforeEach(async ({ page }) => {
    await page.exposeFunction('isValidPhoneNumber', isValidPhoneNumber);
  });

  const validTestDataSet = [
    { countryCode: 'IN', phoneNumber: '+917394926646' },
    { countryCode: 'MY', phoneNumber: '+60123456789' },
  ];

  const invalidTestDataSet = [
    { countryCode: 'IN', phoneNumber: '1234' },
    { countryCode: 'MY', phoneNumber: '60123' },
  ];

  validTestDataSet.forEach((dataset) => {
    test(`should validate a valid phone number for ${dataset.countryCode}`, async ({
      page,
    }) => {
      await injectScript(
        page,
        `await isValidPhoneNumber('${dataset.phoneNumber}', '${dataset.countryCode}')`,
      );

      await assertScriptText(page, 'true');
    });
  });

  invalidTestDataSet.forEach((dataset) => {
    test(`should reject an invalid phone number for ${dataset.countryCode}`, async ({
      page,
    }) => {
      await injectScript(
        page,
        `await isValidPhoneNumber('${dataset.phoneNumber}', '${dataset.countryCode}')`,
      );

      await assertScriptText(page, 'false');
    });
  });

  test('should handle a invalid country code and detect it from phone number to validate it', async ({
    page,
  }) => {
    const phoneNumber = '1234567890';
    const countryCode = 'XYZ';

    await injectScript(
      page,
      `await isValidPhoneNumber('${phoneNumber}', '${countryCode}')`,
    );

    await assertScriptText(page, 'true');
  });

  test('should handle a missing phoneNumber', async ({ page }) => {
    const phoneNumber = '';
    const countryCode = 'MY';
    await injectScript(
      page,
      `await isValidPhoneNumber('${phoneNumber}', '${countryCode}')`,
    );

    await assertScriptText(page, 'false');
  });
});
