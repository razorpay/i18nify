import formatE164 from '../formatE164';

describe('phoneNumber - formatE164', () => {
  describe('national number → E.164', () => {
    it('should prepend the dial code for a national number', () => {
      expect(formatE164('IN', '9876543210')).toBe('+919876543210');
    });

    it('should accept a numeric phoneNumber argument', () => {
      expect(formatE164('US', 2025550199)).toBe('+12025550199');
    });

    it('should strip formatting characters before prepending', () => {
      // cleanPhoneNumber removes spaces/dashes/parens but keeps all digits as-is
      expect(formatE164('DE', '301 234-5678')).toBe('+493012345678');
    });
  });

  describe('already-prefixed number → normalised E.164', () => {
    it('should return the number unchanged when the prefix matches the country', () => {
      expect(formatE164('IN', '+919876543210')).toBe('+919876543210');
    });

    it('should accept a US number that already carries +1', () => {
      expect(formatE164('US', '+12025550199')).toBe('+12025550199');
    });

    it('should throw when the existing prefix does not match the country code', () => {
      expect(() => formatE164('IN', '+12025550199')).toThrow(
        /does not match country code/,
      );
    });
  });

  describe('invalid arguments', () => {
    it('should throw when phoneNumber is empty string', () => {
      expect(() => formatE164('IN', '')).toThrow(/phoneNumber/);
    });

    it('should throw when phoneNumber is 0', () => {
      expect(() => formatE164('IN', 0)).toThrow(/phoneNumber/);
    });

    it('should throw when countryCode is empty string', () => {
      expect(() => formatE164('' as any, '9876543210')).toThrow(/countryCode/);
    });
  });
});
