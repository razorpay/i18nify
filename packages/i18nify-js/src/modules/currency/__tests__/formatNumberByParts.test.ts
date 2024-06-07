import { CurrencyCodeType, formatNumberByParts } from '../index';
import {
  positiveNumberPartsIntlMap,
  negativeNumberPartsIntlMap,
} from './mocks/formatNumberToParts';

const nbsp = String.fromCharCode(160);

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
      `Error: Parameter 'amount' is not a number. typeof amount: string`,
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
        'Error: Value hola out of range for Intl.NumberFormat options property style',
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
      expect(
        formatNumberByParts(amount, {
          currency: currency as CurrencyCodeType,
          locale: locale as string,
        }),
      ).toEqual(
        positiveNumberPartsIntlMap[
          currency as keyof typeof positiveNumberPartsIntlMap
        ],
      );

      expect(
        formatNumberByParts(-amount, {
          currency: currency as CurrencyCodeType,
          locale: locale as string,
        }),
      ).toEqual(
        negativeNumberPartsIntlMap[
          currency as keyof typeof negativeNumberPartsIntlMap
        ],
      );
    },
  );
});
