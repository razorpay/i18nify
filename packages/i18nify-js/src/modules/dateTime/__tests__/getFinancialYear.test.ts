import getFinancialYear from '../getFinancialYear';

describe('getFinancialYear', () => {
  it('calculates India financial year', () => {
    expect(getFinancialYear(new Date(2024, 3, 1), 'IN')).toBe('2024-25');
    expect(getFinancialYear(new Date(2024, 2, 31), 'IN')).toBe('2023-24');
  });

  it('calculates US financial year in FY format', () => {
    expect(getFinancialYear(new Date(2024, 9, 1), 'US')).toBe('FY2025');
    expect(getFinancialYear(new Date(2024, 8, 30), 'US')).toBe('FY2024');
  });

  it('supports labelFormat override', () => {
    expect(
      getFinancialYear(new Date(2024, 10, 15), 'IN', { labelFormat: 'long' }),
    ).toBe('2024-2025');
  });

  it('throws for unsupported country codes', () => {
    expect(() => getFinancialYear(new Date(), 'DE')).toThrow('not supported');
  });
});
