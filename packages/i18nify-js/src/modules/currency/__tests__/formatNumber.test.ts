import { getLocale } from '../../.internal/utils';
import { setState } from '../../core';
import { CurrencyCodeType, formatNumber } from '../index';

const nbsp = String.fromCharCode(160);
const nnsp = String.fromCharCode(8239);

describe('formatNumber', () => {
  it('should format the amount with default options', () => {
    const result = formatNumber('1000.5', {
      currency: 'USD',
    });
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
    ).toThrow(
      `Error: Parameter 'amount' is not a number. typeof amount: string`,
    );
  });

  it('should format a negative amount', () => {
    const result = formatNumber('-500', {
      currency: 'USD',
    });
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
      `Error: Parameter 'amount' is not a number. typeof amount: string`,
    );
  });

  it('should throw error with a different decimal separator', () => {
    expect(() =>
      formatNumber('1000,5', {
        currency: 'USD',
        intlOptions: { useGrouping: false },
      }),
    ).toThrow(
      `Error: Parameter 'amount' is not a number. typeof amount: string`,
    );
  });

  it('should handle extremely large numbers with precision', () => {
    const input = '1234567890123456.7890123456789012345678901234567890123456';
    setState({ locale: 'en-US' });
    const result = formatNumber(input, { currency: 'USD' });
    expect(result).toBe('$1,234,567,890,123,456.80');
  });

  it('should handle custom currency symbol and placement', () => {
    const result = formatNumber('1000', {
      currency: 'XYZ' as CurrencyCodeType,
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

  const intlMappedTestCases = [
    ['SGD', 'en-SG', 'S$123,456.33'],
    ['XCD', 'en-AI', 'EC$123,456.33'],
    ['ARS', 'en-AR', `ARS${nbsp}123,456.33`],
    ['AUD', 'en-AU', 'A$123,456.33'],
    ['BSD', 'en-BS', 'BSD123,456.33'],
    ['BBD', 'en-BB', 'Bds$123,456.33'],
    ['BMD', 'en-BM', 'BD$123,456.33'],
    ['CVE', 'en-CV', `CVE${nbsp}123,456.33`],
    ['CAD', 'en-CA', 'CA$123,456.33'],
    ['KYD', 'en-KY', 'CI$123,456.33'],
    ['CLP', 'en-CL', `CLP${nbsp}123,456`],
    ['COP', 'en-CO', `COP${nbsp}123,456.33`],
    ['NZD', 'en-CK', 'NZ$123,456.33'],
    ['CUP', 'en-CU', `CUP${nbsp}123,456.33`],
    ['SVC', 'en-SV', `SVC${nbsp}123,456.33`],
    ['FJD', 'en-FJ', 'FJ$123,456.33'],
    ['GYD', 'en-GY', 'GY$123,456.33'],
    ['HKD', 'en-HK', 'HK$123,456.33'],
    ['JMD', 'en-JM', 'J$123,456.33'],
    ['LRD', 'en-LR', 'L$123,456.33'],
    ['MOP', 'en', `MOP${nbsp}123,456.33`],
    ['MXN', 'en-MX', 'MX$123,456.33'],
    ['NAD', 'en-NA', 'N$123,456.33'],
    ['SBD', 'en-SB', 'SI$123,456.33'],
    ['SRD', 'en-SR', `SRD${nbsp}123,456.33`],
    ['ZWL', 'en-ZW', `ZWL${nbsp}123,456.33`],
    ['LSL', 'en-LS', `LSL${nbsp}123,456.33`],
    ['AWG', 'en-AW', `AWG${nbsp}123,456.33`],
    ['BYN', 'en', `BYN${nbsp}123,456.33`],
    ['XAF', 'en-CM', `FCFA${nbsp}123,456`],
    ['CNY', 'en-CN', `CN¥123,456.33`],
    ['EGP', 'en-EG', `EGP${nbsp}123,456.33`],
    ['FKP', 'en-FK', `FK£123,456.33`],
    ['LBP', 'en-LB', `LBP${nbsp}123,456`],
    ['SSP', 'en', `SSP${nbsp}123,456.33`],
    ['WST', 'en-WS', `WS$123,456.33`],
  ];

  it.each(intlMappedTestCases)(
    'formats (+ve and -ve) amount 123456.3276 with currency "%s", locale "%s" to "%s"',
    (currency, locale, expected) => {
      const amount = 123456.3276;
      expect(
        formatNumber(amount, {
          currency: currency as CurrencyCodeType,
          locale: locale as string,
        }),
      ).toBe(expected);

      expect(
        formatNumber(-amount, {
          currency: currency as CurrencyCodeType,
          locale: locale as string,
        }),
      ).toBe(`-${expected}`);
    },
  );
});
