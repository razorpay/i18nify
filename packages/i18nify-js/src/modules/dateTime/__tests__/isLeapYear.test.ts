import isLeapYear from '../isLeapYear';

describe('isLeapYear function', () => {
  test('returns true for leap years', () => {
    expect(isLeapYear(2024)).toBe(true); // Divisible by 4
    expect(isLeapYear(2000)).toBe(true); // Divisible by 100 and 400
  });

  test('returns false for non-leap years', () => {
    expect(isLeapYear(2023)).toBe(false); // Not divisible by 4
    expect(isLeapYear(2100)).toBe(false); // Divisible by 100 but not by 400
  });

  test('works correctly for century years', () => {
    expect(isLeapYear(1900)).toBe(false); // Century year, divisible by 100 but not 400
    expect(isLeapYear(2000)).toBe(true); // Century year, divisible by 100 and 400
  });

  test('handles edge cases', () => {
    expect(isLeapYear(0)).toBe(true); // Year 0 is considered a leap year
    expect(isLeapYear(-4)).toBe(true); // Negative leap year
    expect(isLeapYear(-100)).toBe(false); // Negative non-leap century year
  });
});
