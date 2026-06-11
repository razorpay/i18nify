import getFinancialYear from '../getFinancialYear';

describe('getFinancialYear', () => {
  // India — April 1 → March 31
  describe('India (Apr–Mar)', () => {
    it('Apr 1 → FY starts that year', () => {
      expect(getFinancialYear(new Date(2024, 3, 1), 'IN')).toBe('2024-25');
    });
    it('Nov 15 → same FY as April', () => {
      expect(getFinancialYear(new Date(2024, 10, 15), 'IN')).toBe('2024-25');
    });
    it('Mar 31 → FY started previous April', () => {
      expect(getFinancialYear(new Date(2024, 2, 31), 'IN')).toBe('2023-24');
    });
    it('Jan 1 → FY started previous April', () => {
      expect(getFinancialYear(new Date(2025, 0, 1), 'IN')).toBe('2024-25');
    });
    it('string date input', () => {
      expect(getFinancialYear('2024-11-15', 'IN')).toBe('2024-25');
    });
    it('lowercase country code is normalised', () => {
      expect(getFinancialYear(new Date(2024, 10, 15), 'in')).toBe('2024-25');
    });
  });

  // Australia — July 1 → June 30
  describe('Australia (Jul–Jun)', () => {
    it('Jul 1 → FY starts that year', () => {
      expect(getFinancialYear(new Date(2024, 6, 1), 'AU')).toBe('2024-25');
    });
    it('Jun 30 → FY started previous July', () => {
      expect(getFinancialYear(new Date(2024, 5, 30), 'AU')).toBe('2023-24');
    });
  });

  // US — October 1 → September 30 (fy format)
  describe('US (Oct–Sep, FY format)', () => {
    it('Oct 1 → FY ends next year', () => {
      expect(getFinancialYear(new Date(2024, 9, 1), 'US')).toBe('FY2025');
    });
    it('Sep 30 → FY ends that year', () => {
      expect(getFinancialYear(new Date(2024, 8, 30), 'US')).toBe('FY2024');
    });
    it('Jan 1 → FY end year is same calendar year', () => {
      expect(getFinancialYear(new Date(2025, 0, 1), 'US')).toBe('FY2025');
    });
  });

  // Other supported countries
  describe('other supported countries', () => {
    it('GB (Apr–Mar) same as IN', () => {
      expect(getFinancialYear(new Date(2024, 10, 15), 'GB')).toBe('2024-25');
    });
    it('Pakistan (Jul–Jun)', () => {
      expect(getFinancialYear(new Date(2024, 10, 15), 'PK')).toBe('2024-25');
    });
    it('Japan (Apr–Mar)', () => {
      expect(getFinancialYear(new Date(2024, 2, 31), 'JP')).toBe('2023-24');
    });
  });

  // labelFormat overrides
  describe('labelFormat override', () => {
    it('long format: 2024-2025', () => {
      expect(
        getFinancialYear(new Date(2024, 10, 15), 'IN', { labelFormat: 'long' }),
      ).toBe('2024-2025');
    });
    it('fy format: FY2025', () => {
      expect(
        getFinancialYear(new Date(2024, 10, 15), 'IN', { labelFormat: 'fy' }),
      ).toBe('FY2025');
    });
    it('short override on US', () => {
      expect(
        getFinancialYear(new Date(2024, 9, 1), 'US', { labelFormat: 'short' }),
      ).toBe('2024-25');
    });
    it('long override on US', () => {
      expect(
        getFinancialYear(new Date(2024, 9, 1), 'US', { labelFormat: 'long' }),
      ).toBe('2024-2025');
    });
  });

  // Cross-century edge case
  describe('century boundary', () => {
    it('2-digit year component wraps correctly at century (2099→00)', () => {
      expect(getFinancialYear(new Date(2099, 10, 15), 'IN')).toBe('2099-00');
    });
  });

  // Error cases
  describe('error handling', () => {
    it('throws for unsupported country', () => {
      expect(() => getFinancialYear(new Date(), 'DE')).toThrow('not supported');
    });
    it('throws for unknown country code', () => {
      expect(() => getFinancialYear(new Date(), 'XX')).toThrow('not supported');
    });
    it('throws for missing date', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => getFinancialYear(null as any, 'IN')).toThrow(
        "'date' is invalid",
      );
    });
    it('throws for empty countryCode', () => {
      expect(() => getFinancialYear(new Date(), '')).toThrow(
        "'countryCode' is invalid",
      );
    });
  });
});
