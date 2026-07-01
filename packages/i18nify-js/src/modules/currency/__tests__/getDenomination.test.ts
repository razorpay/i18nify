import getDenomination from '../getDenomination';

describe('getDenomination', () => {
  it('returns denomination array for a valid currency code', () => {
    const result = getDenomination('USD');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns correct denominations for USD', () => {
    const result = getDenomination('USD');
    expect(result).toContain('1');
    expect(result).toContain('100');
  });

  it('returns correct denominations for INR', () => {
    const result = getDenomination('INR');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns correct denominations for JPY', () => {
    const result = getDenomination('JPY');
    expect(Array.isArray(result)).toBe(true);
  });

  it('throws for invalid currency code', () => {
    expect(() => getDenomination('INVALID' as any)).toThrow();
  });
});
