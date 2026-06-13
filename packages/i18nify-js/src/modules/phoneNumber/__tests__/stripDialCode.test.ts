import stripDialCode from '../stripDialCode';

describe('phoneNumber - stripDialCode', () => {
  describe('removes dial code from E.164 number', () => {
    it('should strip +91 from an Indian E.164 number', () => {
      expect(stripDialCode('+919876543210', 'IN')).toBe('9876543210');
    });

    it('should strip +1 from a US E.164 number', () => {
      expect(stripDialCode('+12025550199', 'US')).toBe('2025550199');
    });

    it('should strip +49 from a German E.164 number', () => {
      expect(stripDialCode('+493012345678', 'DE')).toBe('3012345678');
    });
  });

  describe('national number passthrough', () => {
    it('should return a national number unchanged', () => {
      expect(stripDialCode('9876543210', 'IN')).toBe('9876543210');
    });

    it('should strip formatting characters from a national number', () => {
      expect(stripDialCode('987-654-3210', 'IN')).toBe('9876543210');
    });

    it('should accept a numeric phoneNumber argument', () => {
      expect(stripDialCode(9876543210, 'IN')).toBe('9876543210');
    });
  });

  describe('invalid arguments', () => {
    it('should throw when the E.164 prefix does not match the country', () => {
      expect(() => stripDialCode('+12025550199', 'IN')).toThrow(
        /does not start with dial code/,
      );
    });

    it('should throw when phoneNumber is empty string', () => {
      expect(() => stripDialCode('', 'IN')).toThrow(/phoneNumber/);
    });

    it('should throw when countryCode is empty string', () => {
      expect(() => stripDialCode('9876543210', '' as any)).toThrow(
        /countryCode/,
      );
    });

    it('should throw when countryCode is invalid', () => {
      expect(() => stripDialCode('9876543210', 'XX' as any)).toThrow();
    });
  });
});
