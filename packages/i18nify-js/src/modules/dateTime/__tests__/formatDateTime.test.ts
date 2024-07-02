import { formatDateTime } from '../index';
import { DateFormatOptions, DateTimeFormatOptions } from '../types';

describe('dateTime - formatDateTime', () => {
  describe("@dateTimeMode: 'dateTime'", () => {
    // Basic Functionality Tests
    test.each([
      ['2024-01-01T12:00:00', 'en-US', undefined, '1/1/2024, 12:00:00 PM'], // US format with time
      [
        '2024-01-01T00:00:00',
        'en-GB',
        { hour12: false },
        '01/01/2024, 00:00:00',
      ], // UK format with midnight time
      [
        '2024-02-29T15:30:00',
        'en-US',
        { hour12: false },
        '2/29/2024, 15:30:00',
      ], // Leap year with 24-hour format
    ])(
      'formats date "%s" with locale "%s" and options %o to "%s"',
      (date, locale, options, expected) => {
        expect(
          formatDateTime(date, {
            locale: locale,
            dateTimeMode: 'dateTime',
            intlOptions: options,
          }),
        ).toBe(expected);
      },
    );

    test('formats end of year date with time', () => {
      expect(
        formatDateTime('2024-12-31T23:59:59', {
          locale: 'en-US',
          dateTimeMode: 'dateTime',
        }),
      ).toBe('12/31/2024, 11:59:59 PM');
    });

    test('handles invalid date strings', () => {
      expect(() =>
        formatDateTime('invalid-date', {
          locale: 'en-US',
          dateTimeMode: 'dateTime',
        }),
      ).toThrow();
    });

    // Locale and Option Variations
    test('formats date and time with different locales', () => {
      const date = '2024-03-01T20:00:00';
      expect(
        formatDateTime(date, { locale: 'fr-FR', dateTimeMode: 'dateTime' }),
      ).not.toBe(
        formatDateTime(date, { locale: 'de-DE', dateTimeMode: 'dateTime' }),
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

      expect(
        formatDateTime(date, {
          locale: 'en-US',
          dateTimeMode: 'dateTime',
          intlOptions: options1,
        }),
      ).not.toBe(
        formatDateTime(date, {
          locale: 'en-US',
          dateTimeMode: 'dateTime',
          intlOptions: options2,
        }),
      );
    });
  });

  describe("@dateTimeMode: 'dateOnly'", () => {
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
        expect(
          formatDateTime(date, {
            locale: locale,
            dateTimeMode: 'dateOnly',
            intlOptions: options,
          }),
        ).toBe(expected);
      },
    );

    test('formats end of year date', () => {
      expect(
        formatDateTime('2024-12-31', {
          locale: 'en-US',
          dateTimeMode: 'dateOnly',
        }),
      ).toBe('12/31/2024');
    });

    test('handles invalid date strings', () => {
      expect(() =>
        formatDateTime('invalid-date', {
          locale: 'en-US',
          dateTimeMode: 'dateOnly',
        }),
      ).toThrow();
    });

    // Locale and Option Variations
    test('formats date with different locales', () => {
      const date = '2024-03-01';
      expect(
        formatDateTime(date, { locale: 'fr-FR', dateTimeMode: 'dateOnly' }),
      ).not.toBe(
        formatDateTime(date, { locale: 'de-DE', dateTimeMode: 'dateOnly' }),
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
        formatDateTime(date, {
          locale: 'en-US',
          dateTimeMode: 'dateOnly',
          intlOptions: options1,
        }),
      ).not.toBe(
        formatDateTime(date, {
          locale: 'en-US',
          dateTimeMode: 'dateOnly',
          intlOptions: options2,
        }),
      );
    });
  });

  describe("@dateTimeMode: 'timeOnly'", () => {
    // Basic Functionality Tests
    test.each([
      ['2024-01-01T12:00:00', 'en-US', undefined, '12:00:00 PM'], // US format 12-hour clock
      ['2024-01-01T00:00:00', 'en-GB', { hour12: false }, '00:00:00'], // UK format 24-hour clock
      ['2024-01-01T15:30:00', 'en-US', { hour12: false }, '15:30:00'], // US format 24-hour clock
    ])(
      'formats time "%s" with locale "%s" and options %o to "%s"',
      (date, locale, options, expected) => {
        expect(
          formatDateTime(date, {
            locale,
            dateTimeMode: 'timeOnly',
            intlOptions: options,
          }),
        ).toBe(expected);
      },
    );

    test('formats midnight time', () => {
      expect(
        formatDateTime('2024-01-01T00:00:00', {
          locale: 'en-US',
          dateTimeMode: 'timeOnly',
        }),
      ).toBe('12:00:00 AM');
    });

    test('formats end of day time', () => {
      expect(
        formatDateTime('2024-01-01T23:59:59', {
          locale: 'en-US',
          dateTimeMode: 'timeOnly',
        }),
      ).toBe('11:59:59 PM');
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
      expect(
        formatDateTime(date, {
          locale: 'en-US',
          dateTimeMode: 'timeOnly',
          intlOptions: options1,
        }),
      ).not.toBe(
        formatDateTime(date, {
          locale: 'en-US',
          dateTimeMode: 'timeOnly',
          intlOptions: options2,
        }),
      );
    });
  });

  test('throws a generic error message for invalid intl options', () => {
    expect(() =>
      formatDateTime('2024-01-01T12:00:00', {
        locale: 'en-US',
        intlOptions: { weekday: 'dummy' } as any,
      }),
    ).toThrow(
      'Error: An error occurred while creating the DateFormatter instance: Value dummy out of range for Intl.DateTimeFormat options property weekday. Please ensure the provided options are valid and try again.',
    );
  });

  test('formats end of year date without time for undefined options', () => {
    expect(formatDateTime('2024-12-31T23:59:59', undefined)).toBe('12/31/2024');
  });
});
