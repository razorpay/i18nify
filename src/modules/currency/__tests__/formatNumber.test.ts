import formatNumber from '../formatNumber';

describe('formatNumber', () => {
  it('should format the amount with default options', () => {
    const result = formatNumber('1000.5', { currency: 'USD' });
    expect(result).toBe('$1,000.50');
  });

  it('should format the amount with custom locale and currency display', () => {
    const result = formatNumber('1500', {
      currency: 'EUR',
      locale: 'fr-FR',
      intlOptions: {
        currencyDisplay: 'code',
      },
    });
    expect(result).toBe('1 500,00 EUR');
  });

  it('should format the amount without currency symbol', () => {
    const result = formatNumber('750.75', {});
    expect(result).toBe('750.75');
  });

  it('should format the amount with narrow currency symbol', () => {
    const result = formatNumber('5000', {
      currency: 'JPY',
      intlOptions: {
        currencyDisplay: 'narrowSymbol',
      },
    });
    expect(result).toBe('¥5,000');
  });

  it('should format the amount using the browser locale when no custom locale is provided', () => {
    const result = formatNumber('2000', {
      currency: 'CAD',
    });
    const expectedLocale = window.navigator.language;
    const formattedAmount = new Intl.NumberFormat(expectedLocale, {
      style: 'currency',
      currency: 'CAD',
    }).format(2000);
    expect(result).toBe(formattedAmount);
  });

  it('should handle invalid inputs gracefully', () => {
    expect(() =>
      formatNumber('invalid-amount', {
        currency: 'USD',
      }),
    ).toThrow('Parameter `amount` is not a number!');
  });
});
