import { CurrencyCodeType, formatNumberByParts } from '../index';
import { numberPartsIntlMap } from './mocks/formatNumberToParts';
import { ALLOWED_FORMAT_PARTS_KEYS } from '../constants';

const nbsp = String.fromCharCode(160);

const addMinusSignInMock = (mock: any) => {
  return {
    ...mock,
    minusSign: '-',
    rawParts: [{ type: 'minusSign', value: '-' }, ...mock.rawParts],
  };
};

describe('formatNumberByParts', () => {
  it('should format the amount correctly for a given currency', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'USD',
      locale: 'en-US',
    });

    expect(result).toEqual({
      currency: '$',
      decimal: '.',
      fraction: '67',
      integer: '12,345',
      isPrefixSymbol: true,
      rawParts: [
        {
          type: 'currency',
          value: '$',
        },
        {
          type: 'integer',
          value: '12',
        },
        {
          type: 'group',
          value: ',',
        },
        {
          type: 'integer',
          value: '345',
        },
        {
          type: 'decimal',
          value: '.',
        },
        {
          type: 'fraction',
          value: '67',
        },
      ],
    });
  });

  it('should throw error for non-numeric input', () => {
    expect(() =>
      formatNumberByParts('not a number', {
        currency: 'USD',
        locale: 'en-US',
      }),
    ).toThrow(
      "Error: Parameter 'amount' is not a valid number. The received value was: not a number of type string. Please ensure you pass a valid number.",
    );
  });

  it('should use the default locale if locale is not provided', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'USD',
    });

    expect(result).toBeDefined();
  });

  it('should handle invalid currency code', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'XYZ' as CurrencyCodeType,
      locale: 'en-US',
    });
    expect(result).toEqual({
      currency: 'XYZ',
      decimal: '.',
      fraction: '67',
      integer: '12,345',
      isPrefixSymbol: true,
      rawParts: [
        {
          type: 'currency',
          value: 'XYZ',
        },
        {
          type: 'literal',
          value: nbsp,
        },
        {
          type: 'integer',
          value: '12',
        },
        {
          type: 'group',
          value: ',',
        },
        {
          type: 'integer',
          value: '345',
        },
        {
          type: 'decimal',
          value: '.',
        },
        {
          type: 'fraction',
          value: '67',
        },
      ],
    });
  });

  it('should handle different locales', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'EUR',
      locale: 'fr-FR',
    });

    expect(result).toEqual({
      currency: '€',
      decimal: ',',
      fraction: '67',
      integer: '12 345',
      isPrefixSymbol: false,
      rawParts: [
        {
          type: 'integer',
          value: '12',
        },
        {
          type: 'group',
          value: ' ',
        },
        {
          type: 'integer',
          value: '345',
        },
        {
          type: 'decimal',
          value: ',',
        },
        {
          type: 'fraction',
          value: '67',
        },
        {
          type: 'literal',
          value: nbsp,
        },
        {
          type: 'currency',
          value: '€',
        },
      ],
    });
  });

  it('should handle a currency with symbol at the beginning', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'JPY',
      locale: 'ja-JP',
    });

    expect(result).toEqual({
      currency: '￥',
      integer: '12,346',
      isPrefixSymbol: true,
      rawParts: [
        {
          type: 'currency',
          value: '￥',
        },
        {
          type: 'integer',
          value: '12',
        },
        {
          type: 'group',
          value: ',',
        },
        {
          type: 'integer',
          value: '346',
        },
      ],
    });
  });

  it('should handle a currency with decimal value and symbol at the end', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'EUR',
      locale: 'de-DE',
    });

    expect(result).toEqual({
      currency: '€',
      decimal: ',',
      fraction: '67',
      integer: '12.345',
      isPrefixSymbol: false,
      rawParts: [
        {
          type: 'integer',
          value: '12',
        },
        {
          type: 'group',
          value: '.',
        },
        {
          type: 'integer',
          value: '345',
        },
        {
          type: 'decimal',
          value: ',',
        },
        {
          type: 'fraction',
          value: '67',
        },
        {
          type: 'literal',
          value: nbsp,
        },
        {
          type: 'currency',
          value: '€',
        },
      ],
    });
  });

  it('should handle non-Error throws by creating a new Error with a generic message', () => {
    expect(() => {
      formatNumberByParts(123, { intlOptions: { style: 'hola' } } as any);
    }).toThrow(
      new Error(
        'Error: An error occurred while formatting the number: Value hola out of range for Intl.NumberFormat options property style',
      ),
    );
  });

  it('should handle non-Error object throws', () => {
    const customError = { foo: 'bar' };
    expect(() => {
      formatNumberByParts(123, {
        intlOptions: {
          get style() {
            throw customError;
          },
        },
      } as any);
    }).toThrow(
      new Error(
        'Error: An unknown error occurred. Error details: [object Object]',
      ),
    );
  });

  it('should return correct value for isPrefixSymbol for negative amounts', () => {
    const inrParts = formatNumberByParts(-1234567, {
      currency: 'INR',
      locale: 'en-IN',
      intlOptions: { style: 'currency' },
    } as any);

    const eurParts = formatNumberByParts(-1234567, {
      currency: 'EUR',
      locale: 'de-DE',
      intlOptions: { style: 'currency' },
    } as any);

    expect(inrParts.isPrefixSymbol).toEqual(true);
    expect(eurParts.isPrefixSymbol).toEqual(false);

    expect(inrParts.minusSign).toEqual('-');
    expect(eurParts.minusSign).toEqual('-');
  });

  it('should return true as default value of isPrefixSymbol even when currency code is not passed', () => {
    expect(formatNumberByParts(-1234567, {} as any).isPrefixSymbol).toEqual(
      true,
    );
  });

  it('should handle parts with non-allowed types', () => {
    const result = formatNumberByParts(0.5, {
      intlOptions: {
        style: 'percent',
      },
    });

    expect(result).toEqual({
      integer: '50',
      percentSign: '%',
      isPrefixSymbol: true,
      rawParts: [
        {
          type: 'integer',
          value: '50',
        },
        {
          type: 'percentSign',
          value: '%',
        },
      ],
    });
  });

  it('should handle numbers with no integer part', () => {
    const result = formatNumberByParts(0.123, {
      intlOptions: {
        minimumIntegerDigits: 1,
        maximumFractionDigits: 3,
      },
    });

    expect(result).toEqual({
      integer: '0',
      decimal: '.',
      fraction: '123',
      isPrefixSymbol: true,
      rawParts: [
        {
          type: 'integer',
          value: '0',
        },
        {
          type: 'decimal',
          value: '.',
        },
        {
          type: 'fraction',
          value: '123',
        },
      ],
    });
  });

  it('should handle formatting without currency', () => {
    const result = formatNumberByParts(123.45, {
      intlOptions: {
        style: 'decimal',
      },
    });

    expect(result).toEqual({
      integer: '123',
      decimal: '.',
      fraction: '45',
      isPrefixSymbol: true,
      rawParts: [
        {
          type: 'integer',
          value: '123',
        },
        {
          type: 'decimal',
          value: '.',
        },
        {
          type: 'fraction',
          value: '45',
        },
      ],
    });
  });

  it('should handle empty string as amount', () => {
    expect(() => formatNumberByParts('')).toThrow(
      "Parameter 'amount' is not a valid number. The received value was:  of type string. Please ensure you pass a valid number.",
    );
  });

  it('should handle multiple group separators in number', () => {
    const result = formatNumberByParts(1234567.89, {
      currency: 'USD',
      locale: 'en-US',
    });

    expect(result.integer).toBe('1,234,567');
    expect(result.rawParts.filter((p) => p.type === 'group')).toHaveLength(2);
  });

  it('should handle non-Error object throws from Intl.NumberFormat', () => {
    const customError = { message: 'Custom error' };
    expect(() => {
      formatNumberByParts(123, {
        intlOptions: {
          get style() {
            throw customError;
          },
        },
      } as any);
    }).toThrow('An unknown error occurred. Error details: [object Object]');
  });

  it('should handle group separator with no integer part', () => {
    const result = formatNumberByParts(0.123, {
      intlOptions: {
        minimumIntegerDigits: 1,
        maximumFractionDigits: 3,
        useGrouping: true,
      },
    });

    expect(result.integer).toBe('0');
    expect(result.rawParts.filter((p) => p.type === 'group')).toHaveLength(0);
  });

  it('should handle invalid string input', () => {
    expect(() => formatNumberByParts('abc')).toThrow(
      "Parameter 'amount' is not a valid number. The received value was: abc of type string. Please ensure you pass a valid number.",
    );
  });

  it('should handle non-allowed part types', () => {
    const result = formatNumberByParts(123.45, {
      intlOptions: {
        style: 'decimal',
      },
    });

    // Verify that only allowed part types are included in the formatted object
    const formattedKeys = Object.keys(result).filter(
      (key) => key !== 'rawParts' && key !== 'isPrefixSymbol',
    );
    expect(
      formattedKeys.every((key) =>
        ALLOWED_FORMAT_PARTS_KEYS.includes(key as any),
      ),
    ).toBe(true);
  });

  it('should handle empty string input', () => {
    expect(() => formatNumberByParts('')).toThrow(
      "Parameter 'amount' is not a valid number. The received value was:  of type string. Please ensure you pass a valid number.",
    );
  });

  const intlMappedTestCases = [
    ['SGD', 'en-SG'],
    ['XCD', 'en-AI'],
    ['ARS', 'en-AR'],
    ['AUD', 'en-AU'],
    ['BSD', 'en-BS'],
    ['BBD', 'en-BB'],
    ['BMD', 'en-BM'],
    ['CVE', 'en-CV'],
    ['CAD', 'en-CA'],
    ['KYD', 'en-KY'],
    ['CLP', 'en-CL'],
    ['COP', 'en-CO'],
    ['NZD', 'en-CK'],
    ['CUP', 'en-CU'],
    ['SVC', 'en-SV'],
    ['FJD', 'en-FJ'],
    ['GYD', 'en-GY'],
    ['HKD', 'en-HK'],
    ['JMD', 'en-JM'],
    ['LRD', 'en-LR'],
    ['MOP', 'en'],
    ['MXN', 'en-MX'],
    ['NAD', 'en-NA'],
    ['SBD', 'en-SB'],
    ['SRD', 'en-SR'],
    ['ZWL', 'en-ZW'],
    ['LSL', 'en-LS'],
    ['AWG', 'en-AW'],
    ['BYN', 'en'],
    ['XAF', 'en-CM'],
    ['CNY', 'en-CN'],
    ['EGP', 'en-EG'],
    ['FKP', 'en-FK'],
    ['LBP', 'en-LB'],
    ['SSP', 'en'],
    ['WST', 'en-WS'],
  ];

  it.each(intlMappedTestCases)(
    'parses (+ve and -ve) amount 123456.3276 with currency "%s", locale "%s" to "%s"',
    (currency, locale) => {
      const amount = 123456.3276;
      const positiveMock =
        numberPartsIntlMap[currency as keyof typeof numberPartsIntlMap];
      const negativeMock = addMinusSignInMock(positiveMock);

      expect(
        formatNumberByParts(amount, {
          currency: currency as CurrencyCodeType,
          locale: locale as string,
        }),
      ).toEqual(positiveMock);

      expect(
        formatNumberByParts(-amount, {
          currency: currency as CurrencyCodeType,
          locale: locale as string,
        }),
      ).toEqual(negativeMock);
    },
  );
});
