import parseFlexibleDate from '../parseFlexibleDate';

describe('parseFlexibleDate', () => {
  it('accepts a Date object and returns structured fields', () => {
    const date = new Date(2024, 0, 15, 10, 30, 45);
    const result = parseFlexibleDate(date);

    expect(result.year).toBe(2024);
    expect(result.month).toBe(1);
    expect(result.day).toBe(15);
    expect(result.hour).toBe(10);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
  });

  it('accepts a Unix timestamp in milliseconds', () => {
    const timestamp = new Date(2021, 0, 1).getTime();
    const result = parseFlexibleDate(timestamp);

    expect(result.year).toBe(2021);
    expect(result.month).toBe(1);
    expect(result.day).toBe(1);
    expect(result.timestamp).toBe(timestamp);
  });

  it('parses supported date strings', () => {
    expect(parseFlexibleDate('2024-01-15').day).toBe(15);
    expect(parseFlexibleDate('15/01/2024').month).toBe(1);
  });

  it('throws for empty or invalid input', () => {
    expect(() => parseFlexibleDate('' as never)).toThrow(
      'parseFlexibleDate: invalid input',
    );
    expect(() => parseFlexibleDate('not-a-date')).toThrow();
  });
});
