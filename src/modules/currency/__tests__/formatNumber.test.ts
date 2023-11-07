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
    expect(result).toBe('1 500,00 EUR');
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

  it('should format a negative amount', () => {
    const result = formatNumber('-500', { currency: 'USD' });
    expect(result).toBe('-$500.00');
  });

  it('should format zero as "0.00"', () => {
    const result = formatNumber(0, { currency: 'USD' });
    expect(result).toBe('$0.00');
  });

  it('should format with custom minimum and maximum fraction digits', () => {
    const result = formatNumber('42.12345', {
      currency: 'USD',
      intlOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      },
    });
    expect(result).toBe('$42.123');
  });

  it('should format with all default options', () => {
    const result = formatNumber(12345.6789);
    expect(result).toBe('12,345.679');
  });

  it('should handle input with thousands separators', () => {
    expect(formatNumber('1,234,567.89', { currency: 'USD' })).toThrow(
      'Parameter `amount` is not a number!',
    );
  });

  it('should handle input with a different decimal separator', () => {
    const result = formatNumber('1000,5', {
      currency: 'USD',
      intlOptions: { useGrouping: false },
    });
    expect(result).toThrow('Parameter `amount` is not a number!');
  });

  it('should handle extremely large numbers with precision', () => {
    const input = '1234567890123456.7890123456789012345678901234567890123456';
    const result = formatNumber(input, { currency: 'USD' });
    expect(result).toBe('$1,234,567,890,123,456.79');
  });

  it('should handle a large number of digits in the integer part', () => {
    const input = '1234567890123456789012345678901234567.89';
    const result = formatNumber(input, { currency: 'USD' });
    expect(result).toBe(
      '$1,234,567,890,123,456,789,012,345,678,901,234,567.89',
    );
  });

  it('should handle custom currency symbol and placement', () => {
    const result = formatNumber('1000', {
      currency: 'XYZ',
      intlOptions: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currencySign: 'accounting',
      },
    });
    expect(result).toBe('XYZ 1,000.00');
  });
});
