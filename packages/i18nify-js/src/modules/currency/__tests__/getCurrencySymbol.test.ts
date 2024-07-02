import { CurrencyCodeType, getCurrencySymbol } from '../index';

describe('getCurrencySymbol', () => {
  it('should return the correct symbol for a valid currency code', () => {
    const currencyCode = 'USD';
    const expectedSymbol = '$';
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBe(expectedSymbol);
  });

  it('should throw Error for an invalid currency code', () => {
    const currencyCode = 'XYZ'; // An invalid code
    expect(() => getCurrencySymbol(currencyCode as CurrencyCodeType)).toThrow(
      `Error: The provided currency code is invalid. The received value was: ${currencyCode}. Please ensure you pass a valid currency code that is included in the supported list.`,
    );
  });

  it('should throw Error for an empty string', () => {
    const currencyCode = '';
    expect(() => getCurrencySymbol(currencyCode as CurrencyCodeType)).toThrow(
      'Error: The provided currency code is invalid. The received value was: . Please ensure you pass a valid currency code that is included in the supported list.',
    );
  });
});
