import {formatTime} from '../index';
import { DateTimeFormatOptions } from '../types';

describe('formatTime function', () => {
  // Basic Functionality Tests
  test.each([
    ['2024-01-01T12:00:00', 'en-US', undefined, '12:00:00 PM'], // US format 12-hour clock
    ['2024-01-01T00:00:00', 'en-GB', { hour12: false }, '00:00:00'], // UK format 24-hour clock
    ['2024-01-01T15:30:00', 'en-US', { hour12: false }, '15:30:00'], // US format 24-hour clock
  ])(
    'formats time "%s" with locale "%s" and options %o to "%s"',
    (date, locale, options, expected) => {
      expect(formatTime(date, {locale, intlOptions :options})).toBe(expected);
    },
  );

  test('formats midnight time', () => {
    expect(formatTime('2024-01-01T00:00:00', {locale: 'en-US'})).toBe('12:00:00 AM');
  });

  test('formats end of day time', () => {
    expect(formatTime('2024-01-01T23:59:59', {locale: 'en-US'})).toBe('11:59:59 PM');
  });

  test('formats time with different options', () => {
    const date = '2024-03-01T20:00:00';
    const options1 = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    } as Omit<DateTimeFormatOptions, 'dateStyle'>;
    const options2 = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    } as Omit<DateTimeFormatOptions, 'dateStyle'>;
    expect(formatTime(date, {locale: 'en-US', intlOptions :options1})).not.toBe(
      formatTime(date, {locale: 'en-US', intlOptions: options2}),
    );
  });
});
