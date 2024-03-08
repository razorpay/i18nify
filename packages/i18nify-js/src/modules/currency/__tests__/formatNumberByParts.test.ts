import { formatNumberByParts } from '../index';

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
    ).toThrow('Error: Parameter `amount` is not a number!');
  });

  it('should use the default locale if locale is not provided', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'USD',
    });

    expect(result).toBeDefined();
  });

  it('should handle invalid currency code', () => {
    const result = formatNumberByParts(12345.67, {
      // @ts-expect-error invalid currency for testing
      currency: 'XYZ',
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
});
