import parseFlexibleDate from '../parseFlexibleDate';

describe('parseFlexibleDate', () => {
  describe('Date object input', () => {
    it('accepts a Date object and returns structured result', () => {
      const d = new Date(2024, 0, 15, 10, 30, 45); // Jan 15 2024 10:30:45 local
      const result = parseFlexibleDate(d);
      expect(result.date).toBeInstanceOf(Date);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(10);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it('timestamp matches the input Date.getTime()', () => {
      const d = new Date(2024, 5, 20);
      const result = parseFlexibleDate(d);
      expect(result.timestamp).toBe(d.getTime());
    });
  });

  describe('numeric (Unix timestamp ms) input', () => {
    it('accepts a Unix timestamp in milliseconds', () => {
      const ts = new Date(2021, 0, 1).getTime();
      const result = parseFlexibleDate(ts);
      expect(result.year).toBe(2021);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it('timestamp field equals the input number', () => {
      const ts = 1609459200000;
      const result = parseFlexibleDate(ts);
      expect(result.timestamp).toBe(ts);
    });
  });

  describe('ISO 8601 string input', () => {
    it('parses YYYY-MM-DD string', () => {
      const result = parseFlexibleDate('2024-01-15');
      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
    });
  });

  describe('alternative date format strings', () => {
    it('parses DD/MM/YYYY string', () => {
      const result = parseFlexibleDate('15/01/2024');
      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
    });

    it('parses YYYY/MM/DD string', () => {
      const result = parseFlexibleDate('2024/01/15');
      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
    });
  });

  describe('returned structure', () => {
    it('always returns all required fields', () => {
      const result = parseFlexibleDate(new Date(2024, 2, 10));
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('year');
      expect(result).toHaveProperty('month');
      expect(result).toHaveProperty('day');
      expect(result).toHaveProperty('hour');
      expect(result).toHaveProperty('minute');
      expect(result).toHaveProperty('second');
      expect(result).toHaveProperty('timestamp');
    });

    it('month is 1-indexed (1–12)', () => {
      const result = parseFlexibleDate(new Date(2024, 11, 1)); // December
      expect(result.month).toBe(12);
    });

    it('date field is a Date instance', () => {
      const result = parseFlexibleDate(new Date());
      expect(result.date).toBeInstanceOf(Date);
    });
  });

  describe('error handling', () => {
    it('throws for null input', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => parseFlexibleDate(null as any)).toThrow(
        'parseFlexibleDate: invalid input',
      );
    });

    it('throws for undefined input', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => parseFlexibleDate(undefined as any)).toThrow(
        'parseFlexibleDate: invalid input',
      );
    });

    it('throws for empty string', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => parseFlexibleDate('' as any)).toThrow(
        'parseFlexibleDate: invalid input',
      );
    });

    it('throws for an unrecognised date string', () => {
      expect(() => parseFlexibleDate('not-a-date')).toThrow();
    });
  });
});
