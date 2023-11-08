import formatAmountByParts from '../formatAmountByParts';

describe('formatAmountByParts', () => {
  it('should format the amount correctly for a given currency', () => {
    const result = formatAmountByParts('USD', 12345.67, 'en-US');

    expect(result).toEqual({
      currencySymbol: '$',
      integerValue: '12,345',
      decimalValue: '67',
      separator: '.',
      symbolAtFirst: true,
    });
  });

  it('should handle non-numeric input', () => {
    expect(() => formatAmountByParts('USD', 'not a number', 'en-US')).toThrow(
      'Parameter `amount` is not a number!',
    );
  });

  it('should handle an invalid currency code', () => {
    expect(() => formatAmountByParts('XYZ', 12345.67, 'en-US')).toThrow(
      'Something went wrong',
    );
  });

  it('should use the default locale if locale is not provided', () => {
    // Replace 'en-US' with the default locale in your environment
    const result = formatAmountByParts('USD', 12345.67);

    expect(result).toBeDefined();
  });

  it('should format the amount correctly for a given currency and locale', () => {
    const result = formatAmountByParts('USD', 12345.67, 'en-US');

    expect(result).toEqual({
      currencySymbol: '$',
      integerValue: '12,345',
      decimalValue: '67',
      separator: '.',
      symbolAtFirst: true,
    });
  });

  it('should handle non-numeric input', () => {
    expect(() => formatAmountByParts('USD', 'not a number', 'en-US')).toThrow(
      'Parameter `amount` is not a number!',
    );
  });

  it('should handle an invalid currency code', () => {
    expect(() => formatAmountByParts('XYZ', 12345.67, 'en-US')).toThrow(
      'Something went wrong',
    );
  });

  it('should use the default locale if locale is not provided', () => {
    // Replace 'en-US' with the default locale in your environment
    const result = formatAmountByParts('USD', 12345.67);

    expect(result).toBeDefined();
  });

  it('should handle different locales', () => {
    const result = formatAmountByParts('EUR', 12345.67, 'fr-FR');

    expect(result).toEqual({
      currencySymbol: '€',
      decimalValue: '67',
      integerValue: '12 345',
      separator: ',',
      symbolAtFirst: false,
    });
  });

  it('should handle a currency with symbol at the end', () => {
    const result = formatAmountByParts('JPY', 12345.67, 'ja-JP');

    expect(result).toEqual({
      currencySymbol: '￥',
      decimalValue: '',
      integerValue: '12,346',
      separator: '',
      symbolAtFirst: true,
    });
  });

  it('should handle a currency with decimal value and symbol at the end', () => {
    const result = formatAmountByParts('OMR', 12345.67, 'ar-OM');

    expect(result).toEqual({
      currencySymbol: 'ر.ع.',
      decimalValue: '٦٧٠',
      integerValue: '١٢٬٣٤٥',
      separator: '٫',
      symbolAtFirst: false,
    });
  });
});
