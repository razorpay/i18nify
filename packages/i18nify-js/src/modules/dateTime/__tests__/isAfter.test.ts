import isAfter from '../isAfter';

describe('dateTime - isAfter', () => {
  test('returns true when the first date is after the second date', () => {
    expect(isAfter('2024-01-02', '2024-01-01')).toBe(true);
    expect(isAfter(new Date(2024, 0, 2), new Date(2024, 0, 1))).toBe(true);
  });

  test('returns false when the first date is before the second date', () => {
    expect(isAfter('2024-01-01', '2024-01-02')).toBe(false);
    expect(isAfter(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
  });

  test('returns false when the dates are the same', () => {
    expect(isAfter('2024-01-01', '2024-01-01')).toBe(false);
    expect(isAfter(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(false);
  });

  test('handles different time units correctly', () => {
    expect(isAfter('2024-01-01T01:00:00', '2024-01-01T00:59:59')).toBe(true);
    expect(isAfter('2024-01-01T00:00:01', '2024-01-01T00:00:00')).toBe(true);
  });

  test('handles different date formats', () => {
    expect(isAfter('01/02/2024', '01/01/2024')).toBe(true); // MM/DD/YYYY format
    expect(isAfter('2024.01.02', '2024.01.01')).toBe(true); // YYYY.MM.DD format
  });

  test('throws an error for invalid date formats', () => {
    expect(() => isAfter('invalid-date', '2024-01-01')).toThrow(Error);
    expect(() => isAfter('2024-01-01', 'invalid-date')).toThrow(Error);
  });
});
