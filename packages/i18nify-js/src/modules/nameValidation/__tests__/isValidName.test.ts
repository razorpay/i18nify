import { isValidName } from '../index';

describe('isValidName', () => {
  describe('valid names', () => {
    it.each([
      'John',
      'Sarah Connor',
      'María',
      "O'Brien",
      'Jean-Pierre',
      'Søren',
      '김철수',
    ])('accepts "%s"', (name) => {
      expect(isValidName(name).isValid).toBe(true);
    });
  });

  describe('blocklist', () => {
    it.each(['test', 'asdf', 'qwerty', 'admin', 'null', 'undefined', 'none'])(
      'rejects blocklisted name "%s"',
      (name) => {
        const result = isValidName(name);
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe('blocklisted');
      },
    );

    it('blocklist comparison is case-insensitive', () => {
      expect(isValidName('TEST').reason).toBe('blocklisted');
      expect(isValidName('Admin').reason).toBe('blocklisted');
    });

    it('replaces default blocklist when blocklist option is provided', () => {
      const result = isValidName('test', { blocklist: ['batman'] });
      // "test" is NOT in the custom blocklist, so this should pass the blocklist check
      expect(result.reason).not.toBe('blocklisted');
    });

    it('extends default blocklist when allowBlocklistExtension is true', () => {
      const result = isValidName('batman', {
        blocklist: ['batman'],
        allowBlocklistExtension: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('blocklisted');

      // Default entries still blocked
      expect(
        isValidName('test', {
          blocklist: ['batman'],
          allowBlocklistExtension: true,
        }).reason,
      ).toBe('blocklisted');
    });
  });

  describe('sequential character detection', () => {
    // Use strings not in the default blocklist so sequential is the first trigger.
    it.each(['efgh', '5678', 'hgfe', '8765', 'mnop', 'opqr'])(
      'rejects "%s" (sequential chars)',
      (name) => {
        const result = isValidName(name);
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe('sequential_chars');
      },
    );

    it('allows three consecutive chars (below default threshold of 4)', () => {
      // "abc" is in default blocklist, use a non-blocklisted 3-char seq
      const result = isValidName('Joh');
      expect(result.reason).not.toBe('sequential_chars');
    });

    it('respects custom sequentialThreshold', () => {
      // 3 sequential chars should pass with threshold=4 (default)
      expect(isValidName('Kln').reason).not.toBe('sequential_chars');
      // but fail with threshold=3
      const lowThreshold = isValidName('klm', { sequentialThreshold: 3 });
      expect(lowThreshold.isValid).toBe(false);
      expect(lowThreshold.reason).toBe('sequential_chars');
    });
  });

  describe('repeating character detection', () => {
    it.each(['aaab', 'bbbohn', 'joh111n'])(
      'rejects "%s" (repeating chars)',
      (name) => {
        const result = isValidName(name);
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe('repeating_chars');
      },
    );

    it('allows two identical chars in a row (below default threshold of 3)', () => {
      expect(isValidName('Aabbey').reason).not.toBe('repeating_chars');
    });

    it('respects custom repeatingThreshold', () => {
      const result = isValidName('Aabbey', { repeatingThreshold: 2 });
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('repeating_chars');
    });
  });

  describe('alpha dominance check', () => {
    // Not in blocklist, no 4-char sequential run, no 3-char repeat, <50% alpha.
    // "@@##$$" → 0/6 alpha = 0%
    // "1j23"   → 1/4 non-ws alpha = 25%  (2→3 is only 2-char sequence)
    // "j147"   → 1/4 non-ws alpha = 25%  (1→4→7: diffs 3,3 — not sequential by 1)
    it.each(['@@##$$', '1j23', 'j147'])(
      'rejects "%s" (non-alpha dominant)',
      (name) => {
        const result = isValidName(name);
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe('non_alpha_dominant');
      },
    );

    it('ignores whitespace when computing alpha ratio', () => {
      // "John Doe" → 7 alpha / 7 non-ws = 100% — should pass
      expect(isValidName('John Doe').isValid).toBe(true);
    });

    it('respects custom alphaDominanceThreshold', () => {
      // "Jo2n" → 3/4 = 75% alpha — passes default 50% but fails 80% threshold
      const strict = isValidName('Jo2n', { alphaDominanceThreshold: 0.8 });
      expect(strict.isValid).toBe(false);
      expect(strict.reason).toBe('non_alpha_dominant');
    });

    it('accepts unicode letters as alphabetic', () => {
      // "García" — all letters, should pass
      expect(isValidName('García').isValid).toBe(true);
    });
  });

  describe('priority order', () => {
    it('reports blocklisted before sequential check', () => {
      // "abcd" is in the default blocklist AND sequential — blocklist wins
      expect(isValidName('abcd').reason).toBe('blocklisted');
    });
  });
});
