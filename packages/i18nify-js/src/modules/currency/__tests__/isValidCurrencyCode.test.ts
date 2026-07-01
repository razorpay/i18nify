import isValidCurrencyCode from '../isValidCurrencyCode';

describe('isValidCurrencyCode', () => {
  describe('valid ISO 4217 codes', () => {
    it.each([
      'USD',
      'EUR',
      'INR',
      'GBP',
      'JPY',
      'AUD',
      'CAD',
      'CHF',
      'BHD',
      'KWD',
      'KRW',
    ])('%s → true', (code) => expect(isValidCurrencyCode(code)).toBe(true));
  });

  describe('invalid codes', () => {
    it.each(['INVALID', 'XYZ', 'US', 'usd', 'xxx', 'XXX', ''])(
      '"%s" → false',
      (code) => expect(isValidCurrencyCode(code)).toBe(false),
    );
  });

  describe('non-string inputs', () => {
    it.each([undefined, null, 123, {}, [], true])('%p → false', (code) =>
      expect(isValidCurrencyCode(code)).toBe(false),
    );
  });

  describe('type narrowing', () => {
    it('narrows to CurrencyCodeType inside a conditional block', () => {
      const input: unknown = 'EUR';
      if (isValidCurrencyCode(input)) {
        // TypeScript should allow this without type assertion
        const _typed: typeof input = input;
        expect(_typed).toBe('EUR');
      } else {
        fail('expected EUR to be valid');
      }
    });
  });

  describe('case sensitivity', () => {
    it('codes are case-sensitive — lowercase rejected', () => {
      expect(isValidCurrencyCode('usd')).toBe(false);
      expect(isValidCurrencyCode('Usd')).toBe(false);
    });
  });
});
