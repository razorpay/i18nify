import { isValidEmail } from '../index';

describe('isValidEmail', () => {
  describe('valid addresses', () => {
    it.each([
      'user@example.com',
      'user.name+tag@sub.domain.co.uk',
      'user@domain.io',
      'first.last@company.org',
      'user123@host.net',
      'user@xn--nxasmq6b.com',
    ])('accepts "%s"', (email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  describe('invalid addresses', () => {
    it.each([
      ['missing @', 'userexample.com'],
      ['empty local part', '@example.com'],
      ['double @', 'user@@example.com'],
      ['missing domain', 'user@'],
      ['space in address', 'us er@example.com'],
      ['bare localhost (default requires TLD)', 'user@localhost'],
    ])('%s: rejects "%s"', (_label, email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  describe('allowNoTld option', () => {
    it('rejects bare hostname by default', () => {
      expect(isValidEmail('user@localhost')).toBe(false);
    });

    it('accepts bare hostname when allowNoTld is true', () => {
      expect(isValidEmail('user@localhost', { allowNoTld: true })).toBe(true);
    });
  });

  describe('input validation', () => {
    it('throws on empty string', () => {
      expect(() => isValidEmail('')).toThrow();
    });

    it('trims surrounding whitespace before validation', () => {
      expect(isValidEmail('  user@example.com  ')).toBe(true);
    });
  });
});
