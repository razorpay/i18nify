import { parseDateTime } from '../index';
import { DateTimeFormatOptions } from '../types';

describe('dateTime - parseDateTime', () => {
  test('parses standard date input correctly', () => {
    const date = '2024-01-01';
    const result = parseDateTime(date, {
      intlOptions: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    });
    expect(result.date).toBeDefined();
    expect(result.formattedDate).toBe('January 1, 2024');
    expect(result.year).toBe('2024');
    expect(result.month).toBe('January');
    expect(result.day).toBe('1');
  });

  test('formats date according to specified locale', () => {
    const date = '2024-01-01';
    const locale = 'de-DE'; // German locale
    const result = parseDateTime(date, {
      intlOptions: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      locale,
    });
    expect(result.formattedDate).toBe('1. Januar 2024'); // Format in German
  });

  test('throws error for invalid date input', () => {
    const date = 'invalid-date';
    expect(() => parseDateTime(date)).toThrow(Error);
  });

  test('handles leap year correctly', () => {
    const date = '2024-02-29';
    const result = parseDateTime(date);
    if (result.date) {
      expect(result.date.getFullYear()).toBe(2024);
      expect(result.date.getMonth()).toBe(1); // Month is 0-indexed
      expect(result.date.getDate()).toBe(29);
    }
  });

  test('parses time components correctly', () => {
    const dateTime = '2024-01-01 23:59:59';
    const result = parseDateTime(dateTime, {
      intlOptions: {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      },
    });
    expect(result.hour).toBe('23');
    expect(result.minute).toBe('59');
    expect(result.second).toBe('59');
  });

  test('parses date components correctly for undefined options', () => {
    const dateTime = '2024-01-01 23:59:59';
    const result = parseDateTime(dateTime, undefined);
    expect(result.month).toBe('1');
    expect(result.day).toBe('1');
    expect(result.year).toBe('2024');
  });

  test('verifies each date component', () => {
    const date = '2024-01-01';
    const result = parseDateTime(date, {
      intlOptions: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    });
    expect(result.year).toBe('2024');
    expect(result.month).toBe('January');
    expect(result.day).toBe('1');
  });

  test('respects intlOptions settings', () => {
    const date = '2024-01-01';
    const intlOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const result = parseDateTime(date, {
      intlOptions: intlOptions as DateTimeFormatOptions,
    });
    expect(result.formattedDate).toBe('01/01/24');
  });

  test('parses correctly for timestamp input', () => {
    const intlOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const result = parseDateTime(1709878371089, {
      intlOptions: intlOptions as DateTimeFormatOptions,
    });
    expect(result.year).toBe('24');
    expect(result.month).toBe('03');
    expect(result.day).toBe('08');
  });

  test('falls back to system locale if none provided', () => {
    const date = '2024-01-01';
    const result = parseDateTime(date);
    // This test's outcome may vary based on the system's locale
    expect(result.month).toBeDefined();
  });

  test('handles different date formats', () => {
    const dates = ['2024-01-01', '01/01/2024', '01.01.2024'];
    dates.forEach((date) => {
      const result = parseDateTime(date, {
        intlOptions: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      });
      expect(result.year).toBe('2024');
      expect(result.month).toBe('January');
      expect(result.day).toBe('1');
    });
  });

  test('throws a generic error message for invalid intl options', () => {
    expect(() =>
      parseDateTime('2024-01-01T12:00:00', {
        locale: 'en-US',
        intlOptions: { weekday: 'dummy' } as any,
      }),
    ).toThrow(
      'Error: Value dummy out of range for Intl.DateTimeFormat options property weekday',
    );
  });
});
