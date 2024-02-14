import add from '../add';

describe('dateTime - add', () => {
  // Basic Functionality Tests
  test('adds days to a date', () => {
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    expect(add(startDate, {value: 10, unit: 'days'})).toEqual(new Date(2024, 0, 11));
  });

  test('adds months to a date', () => {
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    expect(add(startDate,{value: 2, unit: 'months'})).toEqual(new Date(2024, 2, 1));
  });

  test('adds years to a date', () => {
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    expect(add(startDate, {value: 1, unit: 'years'})).toEqual(new Date(2025, 0, 1));
  });

  test('handles negative values', () => {
    const startDate = new Date(2024, 0, 10);
    expect(add(startDate, {value: -5, unit: 'days'})).toEqual(new Date(2024, 0, 5));
  });

  test('handles adding zero', () => {
    const startDate = new Date(2024, 1, 13);
    expect(add(startDate, {value: 0, unit: 'months'})).toEqual(startDate);
  });

  test('handles leap years', () => {
    const startDate = new Date(2024, 1, 29); // Feb 29, 2024
    expect(add(startDate, {value: 1, unit: 'years'})).toEqual(new Date(2025, 1, 28)); // Feb 28, 2025
  });

  test('handles month-end dates', () => {
    const startDate = new Date(2024, 0, 31); // Jan 31, 2024
    expect(add(startDate, {value: 1, unit: 'months'})).toEqual(new Date(2024, 1, 29)); // Feb 29, 2024
  });

  // Invalid Inputs
  test('throws error for invalid date string', () => {
    expect(() => add('invalid-date', {value: 1, unit: 'days'})).toThrow(
      'Error: Date format not recognized',
    );
  });

  test('throws error for invalid value', () => {
    const startDate = new Date(2024, 0, 1);
    expect(() => add(startDate, {value: NaN, unit: 'days'})).toThrow(
      'Error: Invalid value passed!',
    );
    expect(() => add(startDate, {value: Infinity, unit: 'days'})).toThrow(
      'Error: Invalid value passed!',
    );
  });

  // Type Checking
  test('handles Date object and date string inputs', () => {
    const startDate = new Date(2024, 0, 1);
    const startDateString = '2024-01-01';
    expect(add(startDate, {value: 1, unit: 'days'})).toEqual(add(startDateString, {value: 1, unit: 'days'}));
  });
});
