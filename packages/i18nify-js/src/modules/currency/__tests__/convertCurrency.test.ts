import convertCurrency from '../convertCurrency';

describe('convertCurrency', () => {
  // Basic conversions
  it('USD → JPY: rounds to 0 decimal places (JPY has no minor unit)', () => {
    // 100 USD at rate 149.50 = 14950 JPY (integer)
    expect(
      convertCurrency(100, {
        fromCurrency: 'USD',
        toCurrency: 'JPY',
        exchangeRate: 149.5,
      }),
    ).toBe(14950);
  });

  it('USD → KWD: rounds to 3 decimal places', () => {
    // 100 USD at rate 0.307 = 30.700 KWD
    expect(
      convertCurrency(100, {
        fromCurrency: 'USD',
        toCurrency: 'KWD',
        exchangeRate: 0.307,
      }),
    ).toBe(30.7);
  });

  it('JPY → USD: rounds to 2 decimal places', () => {
    // 1000 JPY at rate 0.0067 = 6.70 USD
    expect(
      convertCurrency(1000, {
        fromCurrency: 'JPY',
        toCurrency: 'USD',
        exchangeRate: 0.0067,
      }),
    ).toBe(6.7);
  });

  it('USD → INR: rounds to 2 decimal places', () => {
    expect(
      convertCurrency(1, {
        fromCurrency: 'USD',
        toCurrency: 'INR',
        exchangeRate: 83.5,
      }),
    ).toBe(83.5);
  });

  it('same currency with rate 1 returns original amount', () => {
    expect(
      convertCurrency(99.99, {
        fromCurrency: 'EUR',
        toCurrency: 'EUR',
        exchangeRate: 1,
      }),
    ).toBe(99.99);
  });

  it('zero amount returns zero', () => {
    expect(
      convertCurrency(0, {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        exchangeRate: 0.92,
      }),
    ).toBe(0);
  });

  // Denomination rounding
  it('result is truncated to toCurrency minor unit (JPY loses fractional amount)', () => {
    // 10.5 USD at 149 = 1564.5 → rounds to 1565 JPY (0 decimal places)
    expect(
      convertCurrency(10.5, {
        fromCurrency: 'USD',
        toCurrency: 'JPY',
        exchangeRate: 149,
      }),
    ).toBe(1565);
  });

  it('KWD result preserves 3 decimal places', () => {
    expect(
      convertCurrency(1, {
        fromCurrency: 'USD',
        toCurrency: 'KWD',
        exchangeRate: 0.3071,
      }),
    ).toBe(0.307);
  });

  // Error cases
  it('throws for invalid fromCurrency', () => {
    expect(() =>
      convertCurrency(100, {
        fromCurrency: 'INVALID' as any,
        toCurrency: 'USD',
        exchangeRate: 1,
      }),
    ).toThrow();
  });

  it('throws for invalid toCurrency', () => {
    expect(() =>
      convertCurrency(100, {
        fromCurrency: 'USD',
        toCurrency: 'INVALID' as any,
        exchangeRate: 1,
      }),
    ).toThrow();
  });

  it('throws for negative exchange rate', () => {
    expect(() =>
      convertCurrency(100, {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        exchangeRate: -0.92,
      }),
    ).toThrow();
  });

  it('throws for zero exchange rate', () => {
    expect(() =>
      convertCurrency(100, {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        exchangeRate: 0,
      }),
    ).toThrow();
  });

  it('throws for Infinity exchange rate', () => {
    expect(() =>
      convertCurrency(100, {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        exchangeRate: Infinity,
      }),
    ).toThrow();
  });
});
