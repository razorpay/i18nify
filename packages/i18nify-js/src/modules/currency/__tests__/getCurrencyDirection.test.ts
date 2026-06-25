import getCurrencyDirection from '../getCurrencyDirection';

describe('getCurrencyDirection', () => {
  // RTL currencies (Arabic-script symbols)
  it('BHD is rtl', () => expect(getCurrencyDirection('BHD')).toBe('rtl'));
  it('KWD is rtl', () => expect(getCurrencyDirection('KWD')).toBe('rtl'));
  it('SAR is rtl', () => expect(getCurrencyDirection('SAR')).toBe('rtl'));
  it('AED is rtl', () => expect(getCurrencyDirection('AED')).toBe('rtl'));
  it('AFN is rtl', () => expect(getCurrencyDirection('AFN')).toBe('rtl'));
  it('IQD is rtl', () => expect(getCurrencyDirection('IQD')).toBe('rtl'));
  it('IRR is rtl', () => expect(getCurrencyDirection('IRR')).toBe('rtl'));
  it('OMR is rtl', () => expect(getCurrencyDirection('OMR')).toBe('rtl'));
  it('QAR is rtl', () => expect(getCurrencyDirection('QAR')).toBe('rtl'));
  it('YER is rtl', () => expect(getCurrencyDirection('YER')).toBe('rtl'));
  it('DZD is rtl', () => expect(getCurrencyDirection('DZD')).toBe('rtl'));

  // LTR currencies
  it('USD is ltr', () => expect(getCurrencyDirection('USD')).toBe('ltr'));
  it('EUR is ltr', () => expect(getCurrencyDirection('EUR')).toBe('ltr'));
  it('INR is ltr', () => expect(getCurrencyDirection('INR')).toBe('ltr'));
  it('GBP is ltr', () => expect(getCurrencyDirection('GBP')).toBe('ltr'));
  // ILS symbol ₪ (U+20AA) is in Currency Symbols block, not Hebrew script → ltr
  it('ILS is ltr (symbol is not Hebrew-script)', () =>
    expect(getCurrencyDirection('ILS')).toBe('ltr'));

  it('throws for invalid currency code', () => {
    // @ts-expect-error testing invalid input
    expect(() => getCurrencyDirection('XXX')).toThrow();
  });
});
