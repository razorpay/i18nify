import { unflattenKeys } from '../index';

describe('unflattenKeys', () => {
  describe('basic unflattening', () => {
    it('unflattens a single dotted key', () => {
      expect(unflattenKeys({ 'a.b': 'x' })).toEqual({ a: { b: 'x' } });
    });

    it('unflattens deeply nested keys', () => {
      expect(unflattenKeys({ 'a.b.c': 'deep' })).toEqual({
        a: { b: { c: 'deep' } },
      });
    });

    it('preserves top-level keys without dots', () => {
      expect(unflattenKeys({ greeting: 'hello', farewell: 'bye' })).toEqual({
        greeting: 'hello',
        farewell: 'bye',
      });
    });

    it('merges sibling keys under the same parent', () => {
      expect(unflattenKeys({ 'a.b': '1', 'a.c': '2' })).toEqual({
        a: { b: '1', c: '2' },
      });
    });
  });

  describe('i18n message bundle round-trip', () => {
    it('unflattens a realistic flat message bundle', () => {
      const input = {
        'auth.login.title': 'Sign in',
        'auth.login.submit': 'Log in',
        'auth.error': 'Invalid credentials',
        'common.ok': 'OK',
        'common.cancel': 'Cancel',
      };
      expect(unflattenKeys(input)).toEqual({
        auth: {
          login: { title: 'Sign in', submit: 'Log in' },
          error: 'Invalid credentials',
        },
        common: { ok: 'OK', cancel: 'Cancel' },
      });
    });
  });

  describe('round-trip with flattenKeys', () => {
    it('flattenKeys then unflattenKeys restores the original object', async () => {
      const { flattenKeys } = await import('../index');
      const original = {
        auth: { login: { title: 'Sign in' }, error: 'Oops' },
        common: { ok: 'OK' },
      };
      expect(unflattenKeys(flattenKeys(original))).toEqual(original);
    });
  });

  describe('custom delimiter', () => {
    it('supports "/" as delimiter', () => {
      expect(unflattenKeys({ 'a/b': 'x' }, { delimiter: '/' })).toEqual({
        a: { b: 'x' },
      });
    });
  });

  describe('collision handling', () => {
    it('overwrites a leaf value when a deeper key expands into it', () => {
      // "a" is set to "leaf", then "a.b" forces "a" to become an object
      const result = unflattenKeys({ a: 'leaf', 'a.b': 'child' });
      expect(result).toEqual({ a: { b: 'child' } });
    });
  });

  describe('edge cases', () => {
    it('returns empty object for empty input', () => {
      expect(unflattenKeys({})).toEqual({});
    });

    it('throws on null input', () => {
      expect(() =>
        unflattenKeys(null as unknown as Record<string, unknown>),
      ).toThrow();
    });

    it('throws on array input', () => {
      expect(() =>
        unflattenKeys([] as unknown as Record<string, unknown>),
      ).toThrow();
    });
  });
});
