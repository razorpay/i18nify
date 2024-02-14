import isValidDate from '../isValidDate';

describe('dateTime - isValidDate', () => {
  test.each([
    // Valid dates for different locales
    ['31/12/2020', 'en-GB', true], // Valid date in British format (DD/MM/YYYY)
    ['2020-12-31', 'sv-SE', true], // Valid date in Swedish format (YYYY-MM-DD)
    ['12-31-2020', 'en-US', true], // Valid date in US format (MM-DD-YYYY)

    // Invalid dates
    ['31/02/2020', 'en-GB', false], // Invalid date, February doesn't have 31 days
    ['2020-13-01', 'sv-SE', false], // Invalid month
    ['02/29/2019', 'en-US', false], // 2019 is not a leap year

    // Leap year dates
    ['29/02/2020', 'en-GB', true], // Leap year date in British format
    ['2020-02-29', 'sv-SE', true], // Leap year date in Swedish format

    // Invalid inputs
    ['invalid-date', 'en-GB', false], // Non-date string
    ['2020/02/31', 'sv-SE', false], // Incorrectly formatted date
    ['12-31-2020', 'en-GB', false], // Format mismatch for British
  ])(
    'validates date "%s" for locale "%s"',
    (dateString, locale, expected) => {
      expect(isValidDate(dateString, {locale})).toBe(expected);
    },
  );

  test('handles non-string inputs gracefully', () => {
    expect(isValidDate(null as unknown as string, {locale: 'en-GB'})).toBe(false);
    expect(isValidDate(12345 as unknown as string, {locale: 'en-GB'})).toBe(false);
  });
});
