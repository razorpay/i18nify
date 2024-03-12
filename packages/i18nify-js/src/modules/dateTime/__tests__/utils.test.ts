import { stringToDate } from '../utils';

describe('dateTime - utils - stringToDate', () => {
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
    { input: '2024-02-29T12:00:00', expected: new Date(2024, 1, 29, 12, 0, 0) },
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
});
