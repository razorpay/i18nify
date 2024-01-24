import isSameDay from '../isSameDay';

describe('isSameDay function', () => {
  test('returns true for the same dates', () => {
    expect(isSameDay('2024-01-01', '2024-01-01')).toBe(true);
    expect(isSameDay(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(true);
  });

  test('returns true for dates with different times but the same day', () => {
    expect(isSameDay('2024-01-01T08:30:00', '2024-01-01T17:45:00')).toBe(true);
    expect(
      isSameDay(new Date(2024, 0, 1, 8, 30), new Date(2024, 0, 1, 17, 45)),
    ).toBe(true);
  });

  test('returns false for different dates', () => {
    expect(isSameDay('2024-01-01', '2024-01-02')).toBe(false);
    expect(isSameDay(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
  });

  test('handles cases around month and year transitions', () => {
    expect(isSameDay('2024-01-01', '2023-12-31')).toBe(false); // Year transition
    expect(isSameDay('2024-01-31', '2024-02-01')).toBe(false); // Month transition
  });

  test('throws an error for invalid date formats', () => {
    expect(() => isSameDay('invalid-date', '2024-01-01')).toThrow(Error);
    expect(() => isSameDay('2024-01-01', 'invalid-date')).toThrow(Error);
  });
});
