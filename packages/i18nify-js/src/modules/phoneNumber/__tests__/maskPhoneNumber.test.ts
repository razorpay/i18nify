import { maskPhoneNumber } from '../index';

describe('maskPhoneNumber', () => {
  describe('default masking (last 4 visible)', () => {
    it('masks a US number with separators', () => {
      expect(maskPhoneNumber('+1-800-555-1234')).toBe('+X-XXX-XXX-1234');
    });

    it('masks an E.164 Indian number', () => {
      expect(maskPhoneNumber('+919876543210')).toBe('+XXXXXXXX3210');
    });

    it('masks a plain 10-digit number (no country code)', () => {
      expect(maskPhoneNumber('9876543210')).toBe('XXXXXX3210');
    });

    it('preserves non-digit separators (spaces, hyphens, parens)', () => {
      expect(maskPhoneNumber('+44 (020) 1234-5678')).toBe(
        '+XX (XXX) XXXX-5678',
      );
    });
  });

  describe('options', () => {
    it('respects custom maskChar', () => {
      expect(maskPhoneNumber('+919876543210', { maskChar: '*' })).toBe(
        '+********3210',
      );
    });

    it('respects custom visibleCount = 6', () => {
      expect(maskPhoneNumber('+919876543210', { visibleCount: 6 })).toBe(
        '+XXXXXX543210',
      );
    });

    it('shows all digits when visibleCount >= total digit count', () => {
      expect(maskPhoneNumber('12345', { visibleCount: 10 })).toBe('12345');
    });
  });

  describe('edge cases', () => {
    it('handles number without leading +', () => {
      expect(maskPhoneNumber('18005551234')).toBe('XXXXXXX1234');
    });

    it('handles number with dot separators', () => {
      expect(maskPhoneNumber('+1.800.555.1234')).toBe('+X.XXX.XXX.1234');
    });
  });

  describe('input validation', () => {
    it('throws on empty string', () => {
      expect(() => maskPhoneNumber('')).toThrow();
    });
  });
});
