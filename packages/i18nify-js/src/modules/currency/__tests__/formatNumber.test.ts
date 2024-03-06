import { getLocale } from '../../.internal/utils';
import { setState } from '../../core';
import formatNumber from '../formatNumber';

const nbsp = String.fromCharCode(160);
const nnsp = String.fromCharCode(8239);

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

    expect(result).toBe(`1${nnsp}500,00${nbsp}EUR`);
  });

  it('should format the amount without currency symbol', () => {
    const result = formatNumber('750.75');
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
    const expectedLocale = getLocale();
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

  it('should throw error with thousands separators', () => {
    expect(() => formatNumber('1,234,567.89', { currency: 'USD' })).toThrow(
      'Parameter `amount` is not a number!',
    );
  });

  it('should throw error with a different decimal separator', () => {
    expect(() =>
      formatNumber('1000,5', {
        currency: 'USD',
        intlOptions: { useGrouping: false },
      }),
    ).toThrow('Parameter `amount` is not a number!');
  });

  it('should handle extremely large numbers with precision', () => {
    const input = '1234567890123456.7890123456789012345678901234567890123456';
    setState({ locale: 'en-US' });
    const result = formatNumber(input, { currency: 'USD' });
    expect(result).toBe('$1,234,567,890,123,456.80');
  });

  it('should handle custom currency symbol and placement', () => {
    const result = formatNumber('1000', {
      // @ts-expect-error invalid currency code for testing
      currency: 'XYZ',
      intlOptions: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currencySign: 'accounting',
      },
    });

    const expected = `XYZ${nbsp}1,000.00`;
    expect(result).toBe(expected);
  });

  it('should round numbers correctly based on fraction digits', () => {
    const result = formatNumber('1000.555', {
      currency: 'USD',
      intlOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    });
    expect(result).toBe('$1,000.56');
  });

  it('should handle very small numbers with precision', () => {
    const result = formatNumber('0.00000012345', {
      currency: 'USD',
      intlOptions: {
        minimumFractionDigits: 10,
      },
    });
    expect(result).toBe('$0.0000001235');
  });

  it('should rethrow the caught Error instance with the same message', () => {
    const errorMessage = 'Error: Invalid currency code : undefined';

    expect(() => {
      formatNumber(123, { intlOptions: { currency: 'undefined' } } as any);
    }).toThrow(new Error(errorMessage));
  });

  it('should handle non-Error throws by creating a new Error with a generic message', () => {
    expect(() => {
      formatNumber(123, { intlOptions: { style: 'hola' } } as any);
    }).toThrow(
      new Error(
        'Error: Value hola out of range for Intl.NumberFormat options property style',
      ),
    );
  });
});
