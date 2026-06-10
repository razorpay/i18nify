import { flattenKeys } from '../index';

describe('flattenKeys', () => {
  describe('basic flattening', () => {
    it('flattens a single nested level', () => {
      expect(flattenKeys({ a: { b: 'x' } })).toEqual({ 'a.b': 'x' });
    });

    it('flattens deeply nested objects', () => {
      expect(flattenKeys({ a: { b: { c: 'deep' } } })).toEqual({
        'a.b.c': 'deep',
      });
    });

    it('preserves top-level leaf keys unchanged', () => {
      expect(flattenKeys({ greeting: 'hello', farewell: 'bye' })).toEqual({
        greeting: 'hello',
        farewell: 'bye',
      });
    });

    it('handles mixed depth correctly', () => {
      expect(flattenKeys({ a: { b: 'nested' }, c: 'top' })).toEqual({
        'a.b': 'nested',
        c: 'top',
      });
    });
  });

  describe('i18n message bundle round-trip', () => {
    it('flattens a realistic message bundle', () => {
      const input = {
        auth: {
          login: { title: 'Sign in', submit: 'Log in' },
          error: 'Invalid credentials',
        },
        common: { ok: 'OK', cancel: 'Cancel' },
      };
      expect(flattenKeys(input)).toEqual({
        'auth.login.title': 'Sign in',
        'auth.login.submit': 'Log in',
        'auth.error': 'Invalid credentials',
        'common.ok': 'OK',
        'common.cancel': 'Cancel',
      });
    });
  });

  describe('leaf value types', () => {
    it('preserves null as a leaf', () => {
      expect(flattenKeys({ a: { b: null } })).toEqual({ 'a.b': null });
    });

    it('preserves numbers as leaves', () => {
      expect(flattenKeys({ count: { max: 42 } })).toEqual({
        'count.max': 42,
      });
    });

    it('preserves booleans as leaves', () => {
      expect(flattenKeys({ feature: { enabled: true } })).toEqual({
        'feature.enabled': true,
      });
    });

    it('treats arrays as leaf values (does not recurse into them)', () => {
      expect(flattenKeys({ tags: ['a', 'b'] })).toEqual({
        tags: ['a', 'b'],
      });
    });
  });

  describe('custom delimiter', () => {
    it('supports "/" as delimiter', () => {
      expect(flattenKeys({ a: { b: 'x' } }, { delimiter: '/' })).toEqual({
        'a/b': 'x',
      });
    });

    it('supports "__" as delimiter', () => {
      expect(flattenKeys({ ns: { key: 'val' } }, { delimiter: '__' })).toEqual({
        ns__key: 'val',
      });
    });
  });

  describe('edge cases', () => {
    it('returns empty object for empty input', () => {
      expect(flattenKeys({})).toEqual({});
    });

    it('throws on null input', () => {
      expect(() =>
        flattenKeys(null as unknown as Record<string, unknown>),
      ).toThrow();
    });

    it('throws on array input', () => {
      expect(() =>
        flattenKeys([] as unknown as Record<string, unknown>),
      ).toThrow();
    });
  });
});
