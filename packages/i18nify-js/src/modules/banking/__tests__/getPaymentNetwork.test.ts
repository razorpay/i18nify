import getPaymentNetwork from '../getPaymentNetwork';

describe('getPaymentNetwork', () => {
  it('returns payment networks for INR', () => {
    expect(getPaymentNetwork('INR')).toEqual({
      networks: ['UPI', 'IMPS', 'NEFT', 'RTGS'],
      primary: 'UPI',
    });
  });

  it('is case-insensitive', () => {
    expect(getPaymentNetwork('usd').primary).toBe('ACH');
  });

  it('throws for empty input', () => {
    expect(() => getPaymentNetwork('')).toThrow(
      "Parameter 'currencyCode' is invalid! The received value was: .",
    );
  });

  it('throws for unsupported currencies', () => {
    expect(() => getPaymentNetwork('XXX')).toThrow(
      'Currency code "XXX" is not supported for payment network lookup.',
    );
  });
});
