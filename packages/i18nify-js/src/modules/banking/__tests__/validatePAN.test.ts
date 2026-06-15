import validatePAN from '../validatePAN';

describe('banking - validatePAN', () => {
  describe('valid PANs', () => {
    it('should accept a valid individual PAN (entity char P)', () => {
      expect(validatePAN('ABCPK1234L')).toBe(true);
    });

    it.each(['C', 'F', 'H', 'A', 'B', 'L', 'J', 'T', 'G'])(
      'should accept a valid PAN with entity char %s',
      (entity) => {
        expect(validatePAN(`ABC${entity}K1234L`)).toBe(true);
      },
    );

    it('should accept a lowercase PAN (case-insensitive)', () => {
      expect(validatePAN('abcpk1234l')).toBe(true);
    });

    it('should accept a PAN with surrounding whitespace', () => {
      expect(validatePAN('  ABCPK1234L  ')).toBe(true);
    });
  });

  describe('invalid PANs', () => {
    it('should reject an invalid 4th (entity) character', () => {
      // 'D' is not a recognised entity-type character.
      expect(validatePAN('ABCDE1234L')).toBe(false);
    });

    it('should reject a PAN that is too short', () => {
      expect(validatePAN('ABCPK123L')).toBe(false);
    });

    it('should reject a PAN that is too long', () => {
      expect(validatePAN('ABCPK1234LL')).toBe(false);
    });

    it('should reject a PAN with digits where letters are expected', () => {
      expect(validatePAN('AB1PK1234L')).toBe(false);
    });

    it('should reject a PAN with letters where digits are expected', () => {
      expect(validatePAN('ABCPKABCDL')).toBe(false);
    });

    it('should reject a PAN ending in a digit', () => {
      expect(validatePAN('ABCPK12345')).toBe(false);
    });

    it('should reject a PAN containing special characters', () => {
      expect(validatePAN('ABCPK-234L')).toBe(false);
    });
  });

  describe('invalid arguments', () => {
    it('should throw for an empty string', () => {
      expect(() => validatePAN('')).toThrow(/PAN/);
    });

    it('should throw for a non-string input', () => {
      // @ts-expect-error testing runtime guard against non-string input
      expect(() => validatePAN(null)).toThrow(/PAN/);
    });
  });
});
