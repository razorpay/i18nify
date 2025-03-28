import { parseDateTime } from '../index';
import { DateTimeFormatOptions } from '../types';
import { mockFormatToParts } from './mocks/dateFormatter';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  convertToStandardDate: jest.fn().mockImplementation((date) => {
    if (date === 'invalid-date') {
      throw new Error('Date format not recognized');
    }
    return new Date(date);
  }),
}));

jest.mock('@internationalized/date', () => ({
  DateFormatter: jest.fn().mockImplementation(() => ({
    formatToParts: mockFormatToParts,
  })),
}));

describe('dateTime - parseDateTime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Default mock implementation for successful cases
    mockFormatToParts.mockImplementation(() => [
      { type: 'month', value: 'January' },
      { type: 'literal', value: ' ' },
      { type: 'day', value: '1' },
      { type: 'literal', value: ', ' },
      { type: 'year', value: '2024' },
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
    mockFormatToParts.mockImplementation(() => [
      { type: 'day', value: '1' },
      { type: 'literal', value: '. ' },
      { type: 'month', value: 'Januar' },
      { type: 'literal', value: ' ' },
      { type: 'year', value: '2024' },
    ]);

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
    expect(result.formattedDate).toBe('1. Januar 2024');
  });

  test('throws error for invalid date input', () => {
    const date = 'invalid-date';
    expect(() => parseDateTime(date)).toThrow('Date format not recognized');
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
    mockFormatToParts.mockImplementation(() => [
      { type: 'hour', value: '23' },
      { type: 'minute', value: '59' },
      { type: 'second', value: '59' },
    ]);

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
    expect(result.month).toBe('January');
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
    mockFormatToParts.mockImplementation(() => [
      { type: 'month', value: '01' },
      { type: 'literal', value: '/' },
      { type: 'day', value: '01' },
      { type: 'literal', value: '/' },
      { type: 'year', value: '24' },
    ]);

    const date = '2024-01-01';
    const intlOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const result = parseDateTime(date, {
      intlOptions: intlOptions as DateTimeFormatOptions,
    });
    expect(result.formattedDate).toBe('01/01/24');
  });

  test('parses correctly for timestamp input', () => {
    mockFormatToParts.mockImplementation(() => [
      { type: 'month', value: '03' },
      { type: 'day', value: '08' },
      { type: 'year', value: '24' },
    ]);

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
    const DateFormatter = require('@internationalized/date').DateFormatter;
    DateFormatter.mockImplementationOnce(() => {
      throw new Error(
        'Value dummy out of range for Intl.DateTimeFormat options property weekday',
      );
    });

    expect(() =>
      parseDateTime('2024-01-01T12:00:00', {
        locale: 'en-US',
        intlOptions: { weekday: 'dummy' } as any,
      }),
    ).toThrow(
      'An error occurred while parsing the date: Value dummy out of range for Intl.DateTimeFormat options property weekday. Please ensure the provided date and options are valid and try again.',
    );
  });

  test('handles non-Error type errors gracefully', () => {
    const DateFormatter = require('@internationalized/date').DateFormatter;
    DateFormatter.mockImplementationOnce(() => {
      throw 'Some non-error object';
    });

    expect(() => parseDateTime('2024-01-01')).toThrow(
      'An unknown error occurred. Error details: Some non-error object',
    );
  });

  test('handles formatted parts with non-allowed keys', () => {
    mockFormatToParts.mockImplementation(() => [
      { type: 'month', value: 'January' },
      { type: 'day', value: '1' },
      { type: 'year', value: '2024' },
      { type: 'timeZoneName', value: 'GMT' },
    ]);

    const date = '2024-01-01';
    const result = parseDateTime(date, {
      intlOptions: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZoneName: 'short',
      },
    });

    expect(result.year).toBe('2024');
    expect(result.month).toBe('January');
    expect(result.day).toBe('1');
    expect(result.rawParts).toBeDefined();
    expect(result.rawParts.some((part) => part.type === 'timeZoneName')).toBe(
      true,
    );
  });

  test('handles undefined locale with undefined intlOptions', () => {
    const date = '2024-01-01';
    const result = parseDateTime(date, {});
    expect(result.date).toBeDefined();
    expect(result.formattedDate).toBeDefined();
  });

  test('handles DateFormatter errors', () => {
    const DateFormatter = require('@internationalized/date').DateFormatter;
    DateFormatter.mockImplementationOnce(() => {
      throw new Error('DateFormatter error');
    });

    expect(() => parseDateTime('2024-01-01')).toThrow(
      'An error occurred while parsing the date: DateFormatter error',
    );
  });

  test('handles errors in formatToParts', () => {
    mockFormatToParts.mockImplementationOnce(() => {
      throw new Error('formatToParts error');
    });

    expect(() => parseDateTime('2024-01-01')).toThrow(
      'An error occurred while parsing the date: formatToParts error',
    );
  });
});
