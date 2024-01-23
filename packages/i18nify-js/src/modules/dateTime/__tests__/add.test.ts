import add from '../add';

describe('dateTime - add', () => {
  // Basic Functionality Tests
  test('adds days to a date', () => {
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    expect(add(startDate, 10, 'days')).toEqual(new Date(2024, 0, 11));
  });

  test('adds months to a date', () => {
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    expect(add(startDate, 2, 'months')).toEqual(new Date(2024, 2, 1));
  });

  test('adds years to a date', () => {
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    expect(add(startDate, 1, 'years')).toEqual(new Date(2025, 0, 1));
  });

  // Edge Cases
  test('handles negative values', () => {
    const startDate = new Date(2024, 0, 10);
    expect(add(startDate, -5, 'days')).toEqual(new Date(2024, 0, 5));
  });

  test('handles adding zero', () => {
    const startDate = new Date(2024, 1, 13);
    expect(add(startDate, 0, 'months')).toEqual(startDate);
  });

  test('handles leap years', () => {
    const startDate = new Date(2024, 1, 29); // Feb 29, 2024
    expect(add(startDate, 1, 'years')).toEqual(new Date(2025, 1, 28)); // Feb 28, 2025
  });

  test('handles month-end dates', () => {
    const startDate = new Date(2024, 0, 31); // Jan 31, 2024
    expect(add(startDate, 1, 'months')).toEqual(new Date(2024, 1, 29)); // Feb 29, 2024
  });

  // Invalid Inputs
  test('throws error for invalid date string', () => {
    expect(() => add('invalid-date', 1, 'days')).toThrow(
      'Error: Date format not recognized',
    );
  });

  test('throws error for invalid value', () => {
    const startDate = new Date(2024, 0, 1);
    expect(() => add(startDate, NaN, 'days')).toThrow(
      'Error: Invalid value passed!',
    );
    expect(() => add(startDate, Infinity, 'days')).toThrow(
      'Error: Invalid value passed!',
    );
  });

  // Type Checking
  test('handles Date object and date string inputs', () => {
    const startDate = new Date(2024, 0, 1);
    const startDateString = '2024-01-01';
    expect(add(startDate, 1, 'days')).toEqual(add(startDateString, 1, 'days'));
  });
});
