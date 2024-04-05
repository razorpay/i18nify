import { CurrencyCodeType, getCurrencySymbol } from '../index';

describe('getCurrencySymbol', () => {
  it('should return the correct symbol for a valid currency code', () => {
    const currencyCode = 'USD' as CurrencyCodeType;
    const expectedSymbol = '$';
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBe(expectedSymbol);
  });

  it('should throw Error for an invalid currency code', () => {
    const currencyCode = 'XYZ'; // An invalid code
    expect(() => getCurrencySymbol(currencyCode as CurrencyCodeType)).toThrow(
      'Error: Invalid currencyCode: XYZ',
    );
  });

  it('should throw Error for an empty string', () => {
    const currencyCode = '';
    expect(() => getCurrencySymbol(currencyCode as CurrencyCodeType)).toThrow(
      'Error: Invalid currencyCode: ',
    );
  });
});
