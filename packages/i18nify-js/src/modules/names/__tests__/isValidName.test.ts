import { isValidName } from '../index';

describe('names - isValidName', () => {
  describe('valid names', () => {
    it('returns valid for a normal full name', () => {
      expect(isValidName('Ada Lovelace')).toEqual({ isValid: true });
    });

    it('returns valid for names with non-ASCII letters', () => {
      expect(isValidName('José Álvarez')).toEqual({ isValid: true });
      expect(isValidName('निखिल')).toEqual({ isValid: true });
    });

    it('trims surrounding whitespace', () => {
      expect(isValidName('  Grace Hopper  ')).toEqual({ isValid: true });
    });
  });

  describe('invalid names', () => {
    it('rejects names shorter than validation_rules.min_length', () => {
      expect(isValidName('A')).toEqual({
        isValid: false,
        reason: 'too_short',
      });
    });

    it('rejects names longer than validation_rules.max_length', () => {
      expect(isValidName('A'.repeat(101))).toEqual({
        isValid: false,
        reason: 'too_long',
      });
    });

    it('rejects blocklisted placeholder names', () => {
      expect(isValidName('test')).toEqual({
        isValid: false,
        reason: 'blocklisted',
      });
    });

    it('rejects sequential character runs', () => {
      expect(isValidName('pqrs')).toEqual({
        isValid: false,
        reason: 'sequential_chars',
      });
    });

    it('rejects sequential character runs split by spaces', () => {
      expect(isValidName('a b c d')).toEqual({
        isValid: false,
        reason: 'sequential_chars',
      });
    });

    it('rejects repeated character runs', () => {
      expect(isValidName('Sss Sharma')).toEqual({
        isValid: false,
        reason: 'repeating_chars',
      });
    });

    it('rejects values where letters are not dominant', () => {
      expect(isValidName('12@#$ab')).toEqual({
        isValid: false,
        reason: 'non_alpha_dominant',
      });
    });
  });

  describe('options', () => {
    it('uses a custom blocklist as a replacement by default', () => {
      expect(isValidName('test', { blocklist: ['blocked'] })).toEqual({
        isValid: true,
      });
      expect(isValidName('blocked', { blocklist: ['blocked'] })).toEqual({
        isValid: false,
        reason: 'blocklisted',
      });
    });

    it('can extend the default blocklist', () => {
      expect(
        isValidName('blocked', {
          blocklist: ['blocked'],
          allowBlocklistExtension: true,
        }),
      ).toEqual({
        isValid: false,
        reason: 'blocklisted',
      });
      expect(
        isValidName('test', {
          blocklist: ['blocked'],
          allowBlocklistExtension: true,
        }),
      ).toEqual({
        isValid: false,
        reason: 'blocklisted',
      });
    });

    it('uses custom sequential and repeating thresholds', () => {
      expect(isValidName('wxy', { sequentialThreshold: 3 })).toEqual({
        isValid: false,
        reason: 'sequential_chars',
      });
      expect(isValidName('mnop', { sequentialThreshold: 5 })).toEqual({
        isValid: true,
      });
      expect(isValidName('Annaa', { repeatingThreshold: 2 })).toEqual({
        isValid: false,
        reason: 'repeating_chars',
      });
    });

    it('uses a custom alpha dominance threshold', () => {
      expect(
        isValidName('a1 b2', {
          alphaDominanceThreshold: 0.75,
        }),
      ).toEqual({
        isValid: false,
        reason: 'non_alpha_dominant',
      });
    });
  });

  describe('invalid arguments', () => {
    it('throws for an empty string', () => {
      expect(() => isValidName('')).toThrow(/name/);
    });

    it('throws for a whitespace-only string', () => {
      expect(() => isValidName('   ')).toThrow(/name/);
    });

    it('throws for a non-string argument', () => {
      expect(() => isValidName(123 as any)).toThrow(/name/);
    });
  });
});
