import { stringToDate, convertToStandardDate } from '../utils';

describe('dateTime - utils', () => {
  describe('stringToDate', () => {
    // Test valid date formats
    const validDates = [
      { input: '2024/02/29', expected: new Date(2024, 1, 29) },
      { input: '29/02/2024', expected: new Date(2024, 1, 29) },
      { input: '2024.02.29', expected: new Date(2024, 1, 29) },
      { input: '29-02-2024', expected: new Date(2024, 1, 29) },
      { input: '02/29/2024', expected: new Date(2024, 1, 29) },
      { input: '2024-02-29', expected: new Date(2024, 1, 29) },
      { input: '2024. 02. 29.', expected: new Date(2024, 1, 29) },
      { input: '02.29.2024', expected: new Date(2024, 1, 29) },
      {
        input: '2024-02-29T12:00:00',
        expected: new Date(2024, 1, 29, 12, 0, 0),
      },
      { input: '13/01/2024', expected: new Date('01/13/2024') },
    ];

    validDates.forEach(({ input, expected }) => {
      test(`correctly converts '${input}' to a Date object`, () => {
        expect(stringToDate(input)).toEqual(expected);
      });
    });

    // Test invalid date formats
    const invalidDateFormats = [
      '2024/13/01',
      '2024.13.01',
      '01-32-2024',
      '2024-13-01',
      '2024. 13. 01.',
    ];

    invalidDateFormats.forEach((input) => {
      test(`throws an error for invalid date format string '${input}'`, () => {
        expect(() => stringToDate(input)).toThrow('Date format not recognized');
      });
    });

    // Test invalid dates
    const invalidDates = ['32/01/2024', '2024-02-29T25:00:00'];

    invalidDates.forEach((input) => {
      test(`throws an error for invalid date string '${input}'`, () => {
        expect(() => stringToDate(input)).toThrow('Invalid Date!');
      });
    });

    // Test valid leap year date
    test('correctly identifies leap year dates', () => {
      expect(stringToDate('2024/02/29')).toEqual(new Date(2024, 1, 29));
    });

    // Test for timestamps
    test('correctly converts timestamps', () => {
      expect(stringToDate('2024-02-29T23:59:59')).toEqual(
        new Date(2024, 1, 29, 23, 59, 59),
      );
    });

    // Test for handling non-Error object in catch block
    test('handles non-Error object in catch block', () => {
      const input = '2024-02-29T23:59:59';
      // Mock Date constructor to throw a non-Error object
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super();
          throw 'non-Error object';
        }
      } as any;

      expect(() => stringToDate(input)).toThrow(
        'An unknown error occurred. Error details: non-Error object',
      );

      // Restore original Date constructor
      global.Date = originalDate;
    });
  });

  describe('convertToStandardDate', () => {
    // Test for converting string date in YYYY/MM/DD format
    test('converts "2023/04/01" string to Date object', () => {
      const input = '2023/04/01';
      const expected = new Date(2023, 3, 1); // Note: JS months are 0-based
      const result = convertToStandardDate(input);
      expect(result).toEqual(expected);
    });

    // Test for converting string date in DD-MM-YYYY format
    test('converts "01-04-2023" string to Date object', () => {
      const input = '01-04-2023';
      const expected = new Date(2023, 3, 1);
      const result = convertToStandardDate(input);
      expect(result).toEqual(expected);
    });

    // Test for converting ISO 8601 string to Date object
    test('converts "2023-04-01T00:00:00" string to Date object', () => {
      const input = '2023-04-01T00:00:00';
      const expected = new Date('2023-04-01T00:00:00');
      const result = convertToStandardDate(input);
      expect(result).toEqual(expected);
    });

    // Test for handling invalid date format
    test('throws error for unrecognized date format "04-2023-01"', () => {
      const input = '04-2023-01';
      expect(() => convertToStandardDate(input)).toThrow(
        'Date format not recognized',
      );
    });

    // Test for handling Date object input
    test('returns the same Date object if input is a Date object', () => {
      const input = new Date(2023, 3, 1);
      const result = convertToStandardDate(input);
      expect(result).toEqual(input);
    });

    // Test for handling number (timestamp) input
    test('converts timestamp to Date object', () => {
      const timestamp = new Date(2023, 3, 1).getTime();
      const expected = new Date(2023, 3, 1);
      const result = convertToStandardDate(timestamp);
      expect(result).toEqual(expected);
    });
  });
});
