import isBefore from '../isBefore';

describe('dateTime - isBefore', () => {
  test('returns true when the first date is before the second date', () => {
    expect(isBefore('2024-01-01', '2024-01-02')).toBe(true);
    expect(isBefore(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(true);
  });

  test('returns false when the first date is after the second date', () => {
    expect(isBefore('2024-01-02', '2024-01-01')).toBe(false);
    expect(isBefore(new Date(2024, 0, 2), new Date(2024, 0, 1))).toBe(false);
  });

  test('returns false when the dates are the same', () => {
    expect(isBefore('2024-01-01', '2024-01-01')).toBe(false);
    expect(isBefore(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(false);
  });

  test('handles different time units correctly', () => {
    expect(isBefore('2024-01-01T00:00:00', '2024-01-01T00:00:01')).toBe(true);
    expect(isBefore('2024-01-01T23:59:59', '2024-01-02T00:00:00')).toBe(true);
  });

  test('handles different date formats', () => {
    expect(isBefore('01/01/2024', '01/02/2024')).toBe(true); // MM/DD/YYYY format
    expect(isBefore('2024.01.01', '2024.01.02')).toBe(true); // YYYY.MM.DD format
  });

  test('throws an error for invalid date formats', () => {
    expect(() => isBefore('invalid-date', '2024-01-01')).toThrow(Error);
    expect(() => isBefore('2024-01-01', 'invalid-date')).toThrow(Error);
  });
});
