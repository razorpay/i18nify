import getCurrencySymbol from '../getCurrencySymbol';

describe('getCurrencySymbol', () => {
  it('should return the correct symbol for a valid currency code', () => {
    const currencyCode = 'USD';
    const expectedSymbol = '$';
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBe(expectedSymbol);
  });

  it('should throw Error for an invalid currency code', () => {
    const currencyCode = 'XYZ'; // An invalid code
    // @ts-expect-error invalid currency code for testing
    expect(() => getCurrencySymbol(currencyCode)).toThrow(
      `Invalid currencyCode: ${currencyCode}`,
    );
  });

  it('should throw Error for an empty string', () => {
    const currencyCode = '';
    // @ts-expect-error invalid currency code for testing
    expect(() => getCurrencySymbol(currencyCode)).toThrow(
      `Invalid currencyCode: ${currencyCode}`,
    );
  });
});
