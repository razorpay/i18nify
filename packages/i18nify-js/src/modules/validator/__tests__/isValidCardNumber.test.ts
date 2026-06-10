import { isValidCardNumber } from '../index';

describe('isValidCardNumber', () => {
  describe('valid card numbers (Luhn check passes)', () => {
    it.each([
      ['Visa test PAN', '4111111111111111'],
      ['Mastercard test PAN', '5500005555555559'],
      ['Amex test PAN', '378282246310005'],
      ['Discover test PAN', '6011111111111117'],
      ['Visa with spaces', '4111 1111 1111 1111'],
      ['Visa with hyphens', '4111-1111-1111-1111'],
    ])('%s: accepts "%s"', (_label, pan) => {
      expect(isValidCardNumber(pan)).toBe(true);
    });
  });

  describe('invalid card numbers', () => {
    it.each([
      ['Luhn check fails (last digit off by 1)', '4111111111111112'],
      ['too short (12 digits)', '411111111111'],
      ['too long (20 digits)', '41111111111111110000'],
      ['contains letters', '4111111111111a11'],
    ])('%s: rejects "%s"', (_label, pan) => {
      expect(isValidCardNumber(pan)).toBe(false);
    });
  });

  describe('allowedLengths option', () => {
    it('rejects a 15-digit Amex when only 16-digit cards are allowed', () => {
      expect(
        isValidCardNumber('378282246310005', { allowedLengths: [16] }),
      ).toBe(false);
    });

    it('accepts a 15-digit Amex when 15 is in allowedLengths', () => {
      expect(
        isValidCardNumber('378282246310005', { allowedLengths: [15, 16] }),
      ).toBe(true);
    });
  });

  describe('separator handling', () => {
    it('strips spaces before validating', () => {
      expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true);
    });

    it('strips hyphens before validating', () => {
      expect(isValidCardNumber('4111-1111-1111-1111')).toBe(true);
    });
  });

  describe('input validation', () => {
    it('throws on empty string', () => {
      expect(() => isValidCardNumber('')).toThrow();
    });
  });
});
