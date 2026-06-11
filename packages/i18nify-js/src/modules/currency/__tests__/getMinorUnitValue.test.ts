import getMinorUnitValue from '../getMinorUnitValue';

describe('getMinorUnitValue', () => {
  it('returns 2 for USD', () => {
    expect(getMinorUnitValue('USD')).toBe(2);
  });

  it('returns 2 for EUR', () => {
    expect(getMinorUnitValue('EUR')).toBe(2);
  });

  it('returns 0 for JPY (no minor unit)', () => {
    expect(getMinorUnitValue('JPY')).toBe(0);
  });

  it('returns 3 for KWD (3 decimal places)', () => {
    expect(getMinorUnitValue('KWD')).toBe(3);
  });

  it('returns 2 for INR', () => {
    expect(getMinorUnitValue('INR')).toBe(2);
  });

  it('returns a number type', () => {
    expect(typeof getMinorUnitValue('USD')).toBe('number');
  });

  it('throws for invalid currency code', () => {
    expect(() => getMinorUnitValue('INVALID' as any)).toThrow();
  });
});
