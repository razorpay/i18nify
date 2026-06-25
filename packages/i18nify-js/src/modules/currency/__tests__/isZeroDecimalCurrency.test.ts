import isZeroDecimalCurrency from '../isZeroDecimalCurrency';

describe('isZeroDecimalCurrency', () => {
  // Known zero-decimal currencies
  it('JPY → true', () => expect(isZeroDecimalCurrency('JPY')).toBe(true));
  it('KRW → true', () => expect(isZeroDecimalCurrency('KRW')).toBe(true));
  it('VND → true', () => expect(isZeroDecimalCurrency('VND')).toBe(true));
  it('ISK → true', () => expect(isZeroDecimalCurrency('ISK')).toBe(true));
  it('CLP → true', () => expect(isZeroDecimalCurrency('CLP')).toBe(true));
  it('BIF → true', () => expect(isZeroDecimalCurrency('BIF')).toBe(true));

  // Standard 2-decimal currencies
  it('USD → false', () => expect(isZeroDecimalCurrency('USD')).toBe(false));
  it('EUR → false', () => expect(isZeroDecimalCurrency('EUR')).toBe(false));
  it('INR → false', () => expect(isZeroDecimalCurrency('INR')).toBe(false));
  it('GBP → false', () => expect(isZeroDecimalCurrency('GBP')).toBe(false));

  // 3-decimal currencies
  it('KWD → false', () => expect(isZeroDecimalCurrency('KWD')).toBe(false));
  it('BHD → false', () => expect(isZeroDecimalCurrency('BHD')).toBe(false));

  it('throws for invalid currency code', () => {
    // @ts-expect-error testing invalid input
    expect(() => isZeroDecimalCurrency('INVALID')).toThrow();
  });
});
