import getWeek from '../getWeek';

describe('dateTime - getWeek', () => {
  test('returns correct week number at the beginning of the year', () => {
    expect(getWeek('2024-01-01')).toBe(1); // First day of the year
    expect(getWeek('2024-01-07')).toBe(2); // Seventh day of the year
  });

  //   [TODO:] Failing test case
  test('returns correct week number at the end of the year', () => {
    expect(getWeek('2024-12-31')).toBe(53); // Last day of a leap year
    expect(getWeek('2023-12-31')).toBe(52); // Last day of a non-leap year
  });

  test('returns correct week number for a leap year', () => {
    expect(getWeek('2024-02-29')).toBe(9); // Leap day
  });

  test('returns correct week number for a date in the middle of the year', () => {
    expect(getWeek('2024-06-15')).toBe(24); // A date in mid-June
  });

  test('handles string and Date inputs', () => {
    expect(getWeek('2024-04-15')).toBe(16); // String input
    expect(getWeek(new Date('2024-04-15'))).toBe(16); // Date object input
  });

  test('throws an error for invalid date inputs', () => {
    expect(() => getWeek('invalid-date')).toThrow('Date format not recognized');
  });
});
