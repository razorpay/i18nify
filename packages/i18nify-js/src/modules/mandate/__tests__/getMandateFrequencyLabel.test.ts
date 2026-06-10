import getMandateFrequencyLabel from '../getMandateFrequencyLabel';

describe('getMandateFrequencyLabel', () => {
  describe('primary frequency codes', () => {
    it('DAILY → "Daily", days: 1', () => {
      const result = getMandateFrequencyLabel('DAILY');
      expect(result.label).toBe('Daily');
      expect(result.days).toBe(1);
    });

    it('WEEKLY → "Weekly", days: 7', () => {
      const result = getMandateFrequencyLabel('WEEKLY');
      expect(result.label).toBe('Weekly');
      expect(result.days).toBe(7);
    });

    it('FORTNIGHTLY → "Fortnightly", days: 14', () => {
      const result = getMandateFrequencyLabel('FORTNIGHTLY');
      expect(result.label).toBe('Fortnightly');
      expect(result.days).toBe(14);
    });

    it('MONTHLY → "Monthly", days: 30', () => {
      const result = getMandateFrequencyLabel('MONTHLY');
      expect(result.label).toBe('Monthly');
      expect(result.days).toBe(30);
    });

    it('BI_MONTHLY → "Bi-Monthly", days: 60', () => {
      const result = getMandateFrequencyLabel('BI_MONTHLY');
      expect(result.label).toBe('Bi-Monthly');
      expect(result.days).toBe(60);
    });

    it('QUARTERLY → "Quarterly", days: 90', () => {
      const result = getMandateFrequencyLabel('QUARTERLY');
      expect(result.label).toBe('Quarterly');
      expect(result.days).toBe(90);
    });

    it('HALF_YEARLY → "Half-Yearly", days: 180', () => {
      const result = getMandateFrequencyLabel('HALF_YEARLY');
      expect(result.label).toBe('Half-Yearly');
      expect(result.days).toBe(180);
    });

    it('YEARLY → "Yearly", days: 365', () => {
      const result = getMandateFrequencyLabel('YEARLY');
      expect(result.label).toBe('Yearly');
      expect(result.days).toBe(365);
    });
  });

  describe('alias codes', () => {
    it('BI_WEEKLY → "Bi-Weekly", days: 14', () => {
      const result = getMandateFrequencyLabel('BI_WEEKLY');
      expect(result.label).toBe('Bi-Weekly');
      expect(result.days).toBe(14);
    });

    it('SEMI_ANNUAL → "Semi-Annual", days: 180', () => {
      const result = getMandateFrequencyLabel('SEMI_ANNUAL');
      expect(result.label).toBe('Semi-Annual');
      expect(result.days).toBe(180);
    });

    it('ANNUAL → "Annual", days: 365', () => {
      const result = getMandateFrequencyLabel('ANNUAL');
      expect(result.label).toBe('Annual');
      expect(result.days).toBe(365);
    });
  });

  describe('AS_PRESENTED — variable frequency', () => {
    it('label is "As Presented"', () => {
      const result = getMandateFrequencyLabel('AS_PRESENTED');
      expect(result.label).toBe('As Presented');
    });

    it('days is undefined (variable frequency)', () => {
      const result = getMandateFrequencyLabel('AS_PRESENTED');
      expect(result.days).toBeUndefined();
    });
  });

  describe('case-insensitive lookup', () => {
    it('lowercase "daily" resolves correctly', () => {
      expect(getMandateFrequencyLabel('daily').label).toBe('Daily');
    });

    it('lowercase "bi_monthly" resolves correctly', () => {
      expect(getMandateFrequencyLabel('bi_monthly').label).toBe('Bi-Monthly');
    });

    it('mixed case "Monthly" resolves correctly', () => {
      expect(getMandateFrequencyLabel('Monthly').label).toBe('Monthly');
    });
  });

  describe('return shape', () => {
    it('always has label and description fields', () => {
      const result = getMandateFrequencyLabel('QUARTERLY');
      expect(typeof result.label).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(result.label.length).toBeGreaterThan(0);
      expect(result.description.length).toBeGreaterThan(0);
    });

    it('days is a positive integer when defined', () => {
      const codes = [
        'DAILY',
        'WEEKLY',
        'FORTNIGHTLY',
        'MONTHLY',
        'BI_MONTHLY',
        'QUARTERLY',
        'HALF_YEARLY',
        'YEARLY',
      ];
      for (const code of codes) {
        const result = getMandateFrequencyLabel(code);
        expect(typeof result.days).toBe('number');
        expect(result.days).toBeGreaterThan(0);
      }
    });
  });

  describe('error handling', () => {
    it('throws for unknown frequency code', () => {
      expect(() => getMandateFrequencyLabel('DECADELY')).toThrow(
        'not supported',
      );
    });

    it('throws for empty string', () => {
      expect(() => getMandateFrequencyLabel('')).toThrow('invalid');
    });
  });
});
