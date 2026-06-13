import maskCardNumber from '../maskCardNumber';

describe('masking - maskCardNumber', () => {
  describe('default behavior', () => {
    it('masks all but the last 4 digits and groups in blocks of 4', () => {
      expect(maskCardNumber('4111111111111111')).toBe('XXXX XXXX XXXX 1111');
    });

    it('accepts spaces and hyphens in the input', () => {
      expect(maskCardNumber('4111-1111 1111-1111')).toBe('XXXX XXXX XXXX 1111');
    });
  });

  describe('custom options', () => {
    it('uses a custom mask character', () => {
      expect(maskCardNumber('4111111111111111', { maskChar: '*' })).toBe(
        '**** **** **** 1111',
      );
    });

    it('supports a custom visible digit count', () => {
      expect(maskCardNumber('4111111111111111', { visibleCount: 6 })).toBe(
        'XXXX XXXX XX11 1111',
      );
    });

    it('disables grouping when groupSize is 0', () => {
      expect(maskCardNumber('4111111111111111', { groupSize: 0 })).toBe(
        'XXXXXXXXXXXX1111',
      );
    });

    it('supports a custom group size and separator', () => {
      expect(
        maskCardNumber('4111111111111111', {
          groupSize: 2,
          groupSeparator: '-',
        }),
      ).toBe('XX-XX-XX-XX-XX-XX-11-11');
    });

    it('shows the full number when visibleCount exceeds the digit count', () => {
      expect(maskCardNumber('1234', { visibleCount: 6 })).toBe('1234');
    });
  });

  describe('invalid input', () => {
    it('throws for an empty string', () => {
      expect(() => maskCardNumber('')).toThrow(
        /cardNumber must be a non-empty string/,
      );
    });

    it('throws for non-digit characters other than spaces or hyphens', () => {
      expect(() => maskCardNumber('4111-1111-1111-ABCD')).toThrow(
        /cardNumber may only contain digits, spaces, or hyphens/,
      );
    });
  });
});
