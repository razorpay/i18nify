import { maskCardNumber } from '../index';

describe('maskCardNumber', () => {
  describe('default masking (last 4 visible, 4-char groups)', () => {
    it('masks a 16-digit card with no separators', () => {
      expect(maskCardNumber('4111111111111111')).toBe('XXXX XXXX XXXX 1111');
    });

    it('masks a 16-digit card with spaces', () => {
      expect(maskCardNumber('4111 1111 1111 1111')).toBe('XXXX XXXX XXXX 1111');
    });

    it('masks a 16-digit card with hyphens', () => {
      expect(maskCardNumber('4111-1111-1111-1111')).toBe('XXXX XXXX XXXX 1111');
    });

    it('masks a 15-digit Amex card', () => {
      expect(maskCardNumber('378282246310005')).toBe('XXXX XXXX XXX0 005');
    });

    it('keeps only the last 4 digits visible', () => {
      const result = maskCardNumber('5500005555555559');
      expect(result).toBe('XXXX XXXX XXXX 5559');
      const visible = result.replace(/[\sX]/g, '');
      expect(visible).toBe('5559');
    });
  });

  describe('options', () => {
    it('respects custom maskChar', () => {
      expect(maskCardNumber('4111111111111111', { maskChar: '*' })).toBe(
        '**** **** **** 1111',
      );
    });

    it('respects custom visibleCount', () => {
      expect(maskCardNumber('4111111111111111', { visibleCount: 6 })).toBe(
        'XXXX XXXX XX11 1111',
      );
    });

    it('disables grouping when groupSize is 0', () => {
      expect(maskCardNumber('4111111111111111', { groupSize: 0 })).toBe(
        'XXXXXXXXXXXX1111',
      );
    });

    it('respects custom groupSize', () => {
      expect(maskCardNumber('4111111111111111', { groupSize: 6 })).toBe(
        'XXXXXX XXXXXX 1111',
      );
    });

    it('respects custom groupSeparator', () => {
      expect(maskCardNumber('4111111111111111', { groupSeparator: '-' })).toBe(
        'XXXX-XXXX-XXXX-1111',
      );
    });
  });

  describe('short card / edge visibleCount', () => {
    it('shows full number when visibleCount >= length', () => {
      expect(maskCardNumber('1234', { visibleCount: 4 })).toBe('1234');
    });

    it('shows full number when visibleCount > length', () => {
      expect(maskCardNumber('1234', { visibleCount: 10 })).toBe('1234');
    });
  });

  describe('input validation', () => {
    it('throws on empty string', () => {
      expect(() => maskCardNumber('')).toThrow();
    });

    it('throws on non-digit characters other than space/hyphen', () => {
      expect(() => maskCardNumber('4111A111111B1111')).toThrow();
    });
  });
});
