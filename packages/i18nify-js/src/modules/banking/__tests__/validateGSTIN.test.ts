import validateGSTIN from '../validateGSTIN';

describe('validateGSTIN', () => {
  describe('valid GSTINs', () => {
    it('Maharashtra individual', () =>
      expect(validateGSTIN('27ABCPD1234F1Z5')).toBe(true));
    it('Karnataka company', () =>
      expect(validateGSTIN('29AABCD1234E1Z3')).toBe(true));
    it('Delhi', () => expect(validateGSTIN('07AAATD1234E1Z6')).toBe(true));
    it('Telangana', () => expect(validateGSTIN('36ABCPD1234F2Z1')).toBe(true));
    it('Andhra Pradesh (new - 37)', () =>
      expect(validateGSTIN('37ABCPD1234F1Z4')).toBe(true));
    it('Ladakh (38)', () =>
      expect(validateGSTIN('38ABCPD1234F1Z2')).toBe(true));
    it('Other Territory (97)', () =>
      expect(validateGSTIN('97ABCPD1234F1Z8')).toBe(true));
    it('Centre (99)', () =>
      expect(validateGSTIN('99ABCPD1234F1Z0')).toBe(true));
    it('normalises lowercase', () =>
      expect(validateGSTIN('27abcpd1234f1z5')).toBe(true));
  });

  describe('invalid GSTINs', () => {
    it('invalid state code (00)', () =>
      expect(validateGSTIN('00ABCPD1234F1Z5')).toBe(false));
    it('invalid state code (39)', () =>
      expect(validateGSTIN('39ABCPD1234F1Z5')).toBe(false));
    it('invalid state code (25)', () =>
      expect(validateGSTIN('25ABCPD1234F1Z5')).toBe(false));
    it('missing Z separator', () =>
      expect(validateGSTIN('27ABCPD1234F1X5')).toBe(false));
    it('entity number 0 invalid', () =>
      expect(validateGSTIN('27ABCPD1234F0Z5')).toBe(false));
    it('too short (14 chars)', () =>
      expect(validateGSTIN('27ABCPD1234F1Z')).toBe(false));
    it('too long (16 chars)', () =>
      expect(validateGSTIN('27ABCPD1234F1Z55')).toBe(false));
  });

  describe('error cases', () => {
    it('throws for empty string', () =>
      expect(() => validateGSTIN('')).toThrow());
    // @ts-expect-error testing invalid type
    it('throws for null', () => expect(() => validateGSTIN(null)).toThrow());
  });
});
