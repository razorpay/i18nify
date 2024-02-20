import formatDate from '../formatDate';
import { DateFormatOptions } from '../types';

describe('dateTime - formatDate', () => {
  // Basic Functionality Tests
  test.each([
    ['2024-01-01', 'en-US', undefined, '1/1/2024'], // US format
    ['2024-01-01', 'en-GB', undefined, '01/01/2024'], // UK format
    [
      '2024-02-29',
      'en-US',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      } as DateFormatOptions,
      '02/29/2024',
    ], // Leap year with specific format
  ])(
    'formats date "%s" with locale "%s" and options %o to "%s"',
    (date, locale, options, expected) => {
      expect(formatDate(date, { locale: locale, intlOptions: options })).toBe(
        expected,
      );
    },
  );

  test('formats end of year date', () => {
    expect(formatDate('2024-12-31', { locale: 'en-US' })).toBe('12/31/2024');
  });

  test('handles invalid date strings', () => {
    expect(() => formatDate('invalid-date', { locale: 'en-US' })).toThrow();
  });

  // Locale and Option Variations
  test('formats date with different locales', () => {
    const date = '2024-03-01';
    expect(formatDate(date, { locale: 'fr-FR' })).not.toBe(
      formatDate(date, { locale: 'de-DE' }),
    );
  });

  test('formats date with different options', () => {
    const date = '2024-03-01';
    const options1 = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    } as DateFormatOptions;
    const options2 = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    } as DateFormatOptions;

    expect(
      formatDate(date, { locale: 'en-US', intlOptions: options1 }),
    ).not.toBe(formatDate(date, { locale: 'en-US', intlOptions: options2 }));
  });
});
