import { isValidDate } from '../index';

describe('dateTime - isValidDate', () => {
  test.each([
    ['31/12/2020', 'en-GB', false],
    ['2020-12-31', 'sv-SE', true],
    ['12-31-2020', 'en-US', true],
    ['31/02/2020', 'en-GB', false],
    ['2020-13-01', 'sv-SE', false],
    ['02/29/2019', 'en-US', true],
    ['29/02/2020', 'en-GB', false],
    ['2020-02-29', 'sv-SE', true],
    ['invalid-date', 'en-GB', false],
    ['2020/02/31', 'sv-SE', true],
    ['12-31-2020', 'en-GB', true],
  ])('validates date "%s" for locale "%s"', (dateString, locale, expected) => {
    expect(isValidDate(dateString)).toBe(expected);
  });

  test('handles non-string inputs gracefully', () => {
    expect(isValidDate(null as any)).toBe(false);
    expect(isValidDate(undefined as unknown as string)).toBe(false);
    expect(isValidDate('')).toBe(false);
  });
});
