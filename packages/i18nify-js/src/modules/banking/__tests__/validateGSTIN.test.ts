import validateGSTIN from '../validateGSTIN';

describe('banking - validateGSTIN', () => {
  describe('valid GSTINs', () => {
    it('should accept a valid GSTIN with state code 27 (Maharashtra)', () => {
      expect(validateGSTIN('27ABCDE1234F1Z5')).toBe(true);
    });

    it('should accept a valid GSTIN with state code 29 (Karnataka)', () => {
      expect(validateGSTIN('29ABCDE1234F2Z6')).toBe(true);
    });

    it('should accept state code 97 (Other Territory)', () => {
      expect(validateGSTIN('97ABCDE1234F1Z5')).toBe(true);
    });

    it('should accept state code 99 (Centre)', () => {
      expect(validateGSTIN('99ABCDE1234F1Z5')).toBe(true);
    });

    it('should accept a lowercase GSTIN (case-insensitive)', () => {
      expect(validateGSTIN('27abcde1234f1z5')).toBe(true);
    });

    it('should accept a GSTIN with surrounding whitespace', () => {
      expect(validateGSTIN('  27ABCDE1234F1Z5  ')).toBe(true);
    });
  });

  describe('invalid state codes', () => {
    it('should reject state code 25 (not assigned)', () => {
      expect(validateGSTIN('25ABCDE1234F1Z5')).toBe(false);
    });

    it('should reject state code 28 (not assigned)', () => {
      expect(validateGSTIN('28ABCDE1234F1Z5')).toBe(false);
    });

    it('should reject state code 00', () => {
      expect(validateGSTIN('00ABCDE1234F1Z5')).toBe(false);
    });

    it('should reject state code 39 (out of range)', () => {
      expect(validateGSTIN('39ABCDE1234F1Z5')).toBe(false);
    });
  });

  describe('invalid format', () => {
    it("should reject a GSTIN whose 14th char is not 'Z'", () => {
      expect(validateGSTIN('27ABCDE1234F1A5')).toBe(false);
    });

    it('should reject a GSTIN that is too short', () => {
      expect(validateGSTIN('27ABCDE1234F1Z')).toBe(false);
    });

    it('should reject a GSTIN that is too long', () => {
      expect(validateGSTIN('27ABCDE1234F1Z55')).toBe(false);
    });

    it('should reject a GSTIN with an entity char of 0', () => {
      // entity slot must be [1-9A-Z], 0 is not allowed.
      expect(validateGSTIN('27ABCDE1234F0Z5')).toBe(false);
    });

    it('should reject letters where the PAN numeric block is expected', () => {
      expect(validateGSTIN('27ABCDEABCDF1Z5')).toBe(false);
    });
  });

  describe('invalid arguments', () => {
    it('should throw for an empty string', () => {
      expect(() => validateGSTIN('')).toThrow(/GSTIN/);
    });

    it('should throw for a non-string input', () => {
      // @ts-expect-error testing runtime guard against non-string input
      expect(() => validateGSTIN(undefined)).toThrow(/GSTIN/);
    });
  });
});
