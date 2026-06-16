import { maskCardNumber } from '../index';
import type { MaskCardOptions } from '../types';

describe('masking - maskCardNumber', () => {
  describe('default options', () => {
    it('should mask all but last 4 digits in groups of 4', () => {
      expect(maskCardNumber('4111111111111111')).toBe('XXXX XXXX XXXX 1111');
    });

    it('should accept hyphen-separated input', () => {
      expect(maskCardNumber('4111-1111-1111-1111')).toBe('XXXX XXXX XXXX 1111');
    });

    it('should accept space-separated input', () => {
      expect(maskCardNumber('4111 1111 1111 1111')).toBe('XXXX XXXX XXXX 1111');
    });

    it('should handle a 15-digit Amex number', () => {
      // 15 digits, last 4 = 0005 → XXXXXXXXXXX0005 → groups: XXXX XXXX XXX0 005
      expect(maskCardNumber('378282246310005')).toBe('XXXX XXXX XXX0 005');
    });
  });

  describe('custom maskChar', () => {
    it('should use * as the mask character', () => {
      expect(maskCardNumber('4111111111111111', { maskChar: '*' })).toBe(
        '**** **** **** 1111',
      );
    });

    it('should use # as the mask character', () => {
      expect(maskCardNumber('4111111111111111', { maskChar: '#' })).toBe(
        '#### #### #### 1111',
      );
    });
  });

  describe('custom visibleCount', () => {
    it('should show the last 6 digits when visibleCount is 6', () => {
      // 16 digits, 10 masked → XXXXXXXXXX111111 → groups: XXXX XXXX XX11 1111
      expect(maskCardNumber('4111111111111111', { visibleCount: 6 })).toBe(
        'XXXX XXXX XX11 1111',
      );
    });

    it('should show all digits when visibleCount exceeds card length', () => {
      expect(maskCardNumber('4111111111111111', { visibleCount: 20 })).toBe(
        '4111 1111 1111 1111',
      );
    });
  });

  describe('groupSize', () => {
    it('should disable grouping when groupSize is 0', () => {
      expect(maskCardNumber('4111111111111111', { groupSize: 0 })).toBe(
        'XXXXXXXXXXXX1111',
      );
    });

    it('should group in pairs when groupSize is 2', () => {
      // 16 digits, 4 visible → XXXXXXXXXXXX1111 → groups of 2: XX XX XX XX XX XX 11 11
      expect(maskCardNumber('4111111111111111', { groupSize: 2 })).toBe(
        'XX XX XX XX XX XX 11 11',
      );
    });
  });

  describe('custom groupSeparator', () => {
    it('should use hyphen as the group separator', () => {
      expect(maskCardNumber('4111111111111111', { groupSeparator: '-' })).toBe(
        'XXXX-XXXX-XXXX-1111',
      );
    });
  });

  describe('combined options', () => {
    it('should apply maskChar, visibleCount, groupSize, and separator together', () => {
      const opts: MaskCardOptions = {
        maskChar: '*',
        visibleCount: 4,
        groupSize: 0,
      };
      expect(maskCardNumber('4111111111111111', opts)).toBe('************1111');
    });
  });

  describe('invalid arguments', () => {
    it('should throw for an empty string', () => {
      expect(() => maskCardNumber('')).toThrow(/cardNumber/);
    });

    it('should throw for a number argument', () => {
      expect(() => maskCardNumber(4111111111111111 as any)).toThrow(
        /cardNumber/,
      );
    });

    it('should throw for a card number containing non-numeric characters', () => {
      expect(() => maskCardNumber('4111-ABCD-1111-1111')).toThrow(/digits/);
    });
  });
});
