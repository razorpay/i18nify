import isValidEmail from '../isValidEmail';

describe('isValidEmail', () => {
  it('returns true for a valid email address', () => {
    expect(isValidEmail('hello.world@example.com')).toBe(true);
  });

  it('trims whitespace before validating', () => {
    expect(isValidEmail('  hello.world@example.com  ')).toBe(true);
  });

  it('returns false for an invalid email address', () => {
    expect(isValidEmail('hello.world@')).toBe(false);
  });

  it('allows emails without a TLD when configured', () => {
    expect(isValidEmail('user@localhost', { allowNoTld: true })).toBe(true);
  });

  it('rejects emails without a TLD by default', () => {
    expect(isValidEmail('user@localhost')).toBe(false);
  });

  it('throws for an empty email', () => {
    expect(() => isValidEmail('')).toThrow('email must be a non-empty string.');
  });
});
