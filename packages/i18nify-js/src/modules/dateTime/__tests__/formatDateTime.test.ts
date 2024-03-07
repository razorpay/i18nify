import {formatDateTime} from '../index';
import { DateTimeFormatOptions } from '../types';

describe('dateTime - formatDateTime', () => {
  // Basic Functionality Tests
  test.each([
    ['2024-01-01T12:00:00', 'en-US', undefined, '1/1/2024, 12:00:00 PM'], // US format with time
    ['2024-01-01T00:00:00', 'en-GB', { hour12: false }, '01/01/2024, 00:00:00'], // UK format with midnight time
    ['2024-02-29T15:30:00', 'en-US', { hour12: false }, '2/29/2024, 15:30:00'], // Leap year with 24-hour format
  ])(
    'formats date "%s" with locale "%s" and options %o to "%s"',
    (date, locale, options, expected) => {
      expect(formatDateTime(date, {locale: locale, intlOptions :options})).toBe(expected);
    },
  );

  test('formats end of year date with time', () => {
    expect(formatDateTime('2024-12-31T23:59:59', {locale: 'en-US'})).toBe(
      '12/31/2024, 11:59:59 PM',
    );
  });

  test('handles invalid date strings', () => {
    expect(() => formatDateTime('invalid-date', {locale: 'en-US'})).toThrow();
  });

  // Locale and Option Variations
  test('formats date and time with different locales', () => {
    const date = '2024-03-01T20:00:00';
    expect(formatDateTime(date, {locale: 'fr-FR'})).not.toBe(
      formatDateTime(date, {locale: 'de-DE'}),
    );
  });

  test('formats date and time with different options', () => {
    const date = '2024-03-01T20:00:00';
    const options1 = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    } as DateTimeFormatOptions;
    const options2 = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    } as DateTimeFormatOptions;
    expect(formatDateTime(date, {locale: 'en-US', intlOptions :options1})).not.toBe(
      formatDateTime(date, {locale: 'en-US', intlOptions: options2}),
    );
  });
});
