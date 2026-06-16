import getMandateFrequencyLabel from '../getMandateFrequencyLabel';

describe('mandate - getMandateFrequencyLabel', () => {
  describe('standard frequency codes', () => {
    it('should return the correct label for DAILY', () => {
      const result = getMandateFrequencyLabel('DAILY');
      expect(result.label).toBe('Daily');
      expect(result.days).toBe(1);
    });

    it('should return the correct label for WEEKLY', () => {
      const result = getMandateFrequencyLabel('WEEKLY');
      expect(result.label).toBe('Weekly');
      expect(result.days).toBe(7);
    });

    it('should return the correct label for MONTHLY', () => {
      const result = getMandateFrequencyLabel('MONTHLY');
      expect(result.label).toBe('Monthly');
      expect(result.days).toBe(30);
    });

    it('should return the correct label for QUARTERLY', () => {
      const result = getMandateFrequencyLabel('QUARTERLY');
      expect(result.label).toBe('Quarterly');
      expect(result.days).toBe(90);
    });

    it('should return the correct label for YEARLY', () => {
      const result = getMandateFrequencyLabel('YEARLY');
      expect(result.label).toBe('Yearly');
      expect(result.days).toBe(365);
    });

    it('should return undefined days for AS_PRESENTED', () => {
      const result = getMandateFrequencyLabel('AS_PRESENTED');
      expect(result.label).toBe('As Presented');
      expect(result.days).toBeUndefined();
    });
  });

  describe('alias codes', () => {
    it('BI_WEEKLY should be an alias for FORTNIGHTLY (14 days)', () => {
      const biWeekly = getMandateFrequencyLabel('BI_WEEKLY');
      const fortnightly = getMandateFrequencyLabel('FORTNIGHTLY');
      expect(biWeekly.days).toBe(14);
      expect(fortnightly.days).toBe(14);
    });

    it('SEMI_ANNUAL should be an alias for HALF_YEARLY (180 days)', () => {
      const semiAnnual = getMandateFrequencyLabel('SEMI_ANNUAL');
      const halfYearly = getMandateFrequencyLabel('HALF_YEARLY');
      expect(semiAnnual.days).toBe(180);
      expect(halfYearly.days).toBe(180);
    });

    it('ANNUAL should be an alias for YEARLY (365 days)', () => {
      expect(getMandateFrequencyLabel('ANNUAL').days).toBe(365);
    });
  });

  describe('case insensitivity', () => {
    it('should accept lowercase frequency codes', () => {
      expect(getMandateFrequencyLabel('monthly').label).toBe('Monthly');
    });

    it('should accept mixed-case frequency codes', () => {
      expect(getMandateFrequencyLabel('Weekly').label).toBe('Weekly');
    });
  });

  describe('invalid arguments', () => {
    it('should throw for an empty string', () => {
      expect(() => getMandateFrequencyLabel('')).toThrow(/frequencyCode/);
    });

    it('should throw for an unsupported frequency code', () => {
      expect(() => getMandateFrequencyLabel('HOURLY')).toThrow(/not supported/);
    });
  });
});
