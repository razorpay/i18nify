import subtract from '../subtract';

describe('dateTime - subtract', () => {
  // Test subtracting days
  test('subtracts days correctly', () => {
    const date = new Date(2024, 0, 31); // January 31, 2024
    const result = subtract(date, 10, 'days');
    expect(result).toEqual(new Date(2024, 0, 21)); // January 21, 2024
  });

  // Test subtracting months
  test('subtracts months correctly', () => {
    const date = new Date(2024, 5, 15); // June 15, 2024
    const result = subtract(date, 2, 'months');
    expect(result).toEqual(new Date(2024, 3, 15)); // April 15, 2024
  });

  // Test subtracting years
  test('subtracts years correctly', () => {
    const date = new Date(2024, 0, 1); // January 1, 2024
    const result = subtract(date, 2, 'years');
    expect(result).toEqual(new Date(2022, 0, 1)); // January 1, 2022
  });

  // Test leap year
  test('handles leap year correctly when subtracting years', () => {
    const date = new Date(2024, 1, 29); // February 29, 2024
    const result = subtract(date, 1, 'years');
    expect(result).toEqual(new Date(2023, 1, 28)); // February 28, 2023
  });

  // Test month end
  test('handles month-end correctly when subtracting months', () => {
    const date = new Date(2024, 2, 31); // March 31, 2024
    const result = subtract(date, 1, 'months');
    expect(result).toEqual(new Date(2024, 1, 29)); // February 29, 2024
  });

  // Test invalid value
  test('throws error for invalid value', () => {
    const date = new Date(2024, 0, 1);
    expect(() => subtract(date, Infinity, 'days')).toThrow(
      'Invalid value passed!',
    );
  });

  // Test invalid date
  test('throws error for invalid date', () => {
    expect(() => subtract('invalid-date', 1, 'days')).toThrow(
      'Date format not recognized',
    );
  });
});
