import getQuarter from '../getQuarter';

describe('dateTime - getQuarter', () => {
  test('returns 1 for dates in the first quarter', () => {
    expect(getQuarter('2024-01-01')).toBe(1); // Beginning of Q1
    expect(getQuarter('2024-02-15')).toBe(1); // Middle of Q1
    expect(getQuarter('2024-03-31')).toBe(1); // End of Q1
  });

  test('returns 2 for dates in the second quarter', () => {
    expect(getQuarter('2024-04-01')).toBe(2); // Beginning of Q2
    expect(getQuarter('2024-05-15')).toBe(2); // Middle of Q2
    expect(getQuarter('2024-06-30')).toBe(2); // End of Q2
  });

  test('returns 3 for dates in the third quarter', () => {
    expect(getQuarter('2024-07-01')).toBe(3); // Beginning of Q3
    expect(getQuarter('2024-08-15')).toBe(3); // Middle of Q3
    expect(getQuarter('2024-09-30')).toBe(3); // End of Q3
  });

  test('returns 4 for dates in the fourth quarter', () => {
    expect(getQuarter('2024-10-01')).toBe(4); // Beginning of Q4
    expect(getQuarter('2024-11-15')).toBe(4); // Middle of Q4
    expect(getQuarter('2024-12-31')).toBe(4); // End of Q4
  });

  test('handles string and Date inputs', () => {
    expect(getQuarter('2024-04-15')).toBe(2); // String input
    expect(getQuarter(new Date('2024-04-15'))).toBe(2); // Date object input
  });

  test('throws an error for invalid date inputs', () => {
    expect(() => getQuarter('invalid-date')).toThrow(
      'Date format not recognized',
    );
  });
});
