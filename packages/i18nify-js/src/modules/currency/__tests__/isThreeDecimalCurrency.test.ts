import isThreeDecimalCurrency from '../isThreeDecimalCurrency';

describe('isThreeDecimalCurrency', () => {
  // Known 3-decimal currencies
  it('BHD → true', () => expect(isThreeDecimalCurrency('BHD')).toBe(true));
  it('KWD → true', () => expect(isThreeDecimalCurrency('KWD')).toBe(true));
  it('OMR → true', () => expect(isThreeDecimalCurrency('OMR')).toBe(true));
  it('JOD → true', () => expect(isThreeDecimalCurrency('JOD')).toBe(true));
  it('IQD → true', () => expect(isThreeDecimalCurrency('IQD')).toBe(true));
  it('TND → true', () => expect(isThreeDecimalCurrency('TND')).toBe(true));
  it('LYD → true', () => expect(isThreeDecimalCurrency('LYD')).toBe(true));

  // Standard 2-decimal currencies
  it('USD → false', () => expect(isThreeDecimalCurrency('USD')).toBe(false));
  it('EUR → false', () => expect(isThreeDecimalCurrency('EUR')).toBe(false));
  it('INR → false', () => expect(isThreeDecimalCurrency('INR')).toBe(false));
  it('GBP → false', () => expect(isThreeDecimalCurrency('GBP')).toBe(false));

  // Zero-decimal currencies
  it('JPY → false', () => expect(isThreeDecimalCurrency('JPY')).toBe(false));
  it('KRW → false', () => expect(isThreeDecimalCurrency('KRW')).toBe(false));

  it('throws for invalid currency code', () => {
    // @ts-expect-error testing invalid input
    expect(() => isThreeDecimalCurrency('INVALID')).toThrow();
  });
});
