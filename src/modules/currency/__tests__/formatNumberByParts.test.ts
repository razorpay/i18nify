import formatNumberByParts from '../formatNumberByParts';

describe('formatNumberByParts', () => {
  it('should format the amount correctly for a given currency', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'USD',
      locale: 'en-US',
    });

    expect(result).toEqual({
      currencySymbol: '$',
      integerValue: '12,345',
      decimalValue: '67',
      separator: '.',
      symbolAtFirst: true,
    });
  });

  it('should handle non-numeric input', () => {
    expect(() =>
      formatNumberByParts('not a number', {
        currency: 'USD',
        locale: 'en-US',
      }),
    ).toThrow('Parameter `amount` is not a number!');
  });

  it('should use the default locale if locale is not provided', () => {
    // Replace 'en-US' with the default locale in your environment
    const result = formatNumberByParts(12345.67, {
      currency: 'USD',
    });

    expect(result).toBeDefined();
  });

  it('should format the amount correctly for a given currency and locale', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'USD',
      locale: 'en-US',
    });

    expect(result).toEqual({
      currencySymbol: '$',
      integerValue: '12,345',
      decimalValue: '67',
      separator: '.',
      symbolAtFirst: true,
    });
  });

  it('should throw error on non-numeric input', () => {
    expect(() =>
      formatNumberByParts('not a number', {
        currency: 'USD',
        locale: 'en-US',
      }),
    ).toThrow('Parameter `amount` is not a number!');
  });

  //   FAILING
  it('should throw error on invalid currency code', () => {
    expect(() =>
      formatNumberByParts(12345.67, {
        currency: 'XYZ',
        locale: 'en-US',
      }),
    ).toThrow('Something went wrong');
  });

  it('should handle different locales', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'EUR',
      locale: 'fr-FR',
    });

    expect(result).toEqual({
      currencySymbol: '€',
      decimalValue: '67',
      integerValue: '12 345',
      separator: ',',
      symbolAtFirst: false,
    });
  });

  it('should handle a currency with symbol at the end', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'JPY',
      locale: 'ja-JP',
    });

    expect(result).toEqual({
      currencySymbol: '￥',
      decimalValue: '',
      integerValue: '12,346',
      separator: '',
      symbolAtFirst: true,
    });
  });

  it('should handle a currency with decimal value and symbol at the end', () => {
    const result = formatNumberByParts(12345.67, {
      currency: 'OMR',
      locale: 'ar-OM',
    });

    expect(result).toEqual({
      currencySymbol: 'ر.ع.',
      decimalValue: '٦٧٠',
      integerValue: '١٢٬٣٤٥',
      separator: '٫',
      symbolAtFirst: false,
    });
  });
});
