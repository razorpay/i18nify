import isValidCardNumber from '../isValidCardNumber';

describe('isValidCardNumber', () => {
  it('returns true for a valid card number', () => {
    expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true);
  });

  it('supports separators and allowed length validation', () => {
    expect(
      isValidCardNumber('5555-5555-5555-4444', { allowedLengths: [16] }),
    ).toBe(true);
  });

  it('returns false for a number that fails the Luhn check', () => {
    expect(isValidCardNumber('4111 1111 1111 1112')).toBe(false);
  });

  it('returns false when the input contains non-digit characters', () => {
    expect(isValidCardNumber('4111 1111 1111 111a')).toBe(false);
  });

  it('returns false for tab-separated digits', () => {
    expect(isValidCardNumber('4111\t1111\t1111\t1111')).toBe(false);
  });

  it('returns false when the card length is not allowed', () => {
    expect(
      isValidCardNumber('4111111111111111', { allowedLengths: [15] }),
    ).toBe(false);
  });

  it('throws for an empty card number', () => {
    expect(() => isValidCardNumber('')).toThrow(
      'cardNumber must be a non-empty string.',
    );
  });

  it('throws for a whitespace-only card number', () => {
    expect(() => isValidCardNumber('   ')).toThrow(
      'cardNumber must be a non-empty string.',
    );
  });
});
