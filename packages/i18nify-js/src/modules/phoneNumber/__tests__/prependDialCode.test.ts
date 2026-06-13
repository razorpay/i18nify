import prependDialCode from '../prependDialCode';

describe('phoneNumber - prependDialCode', () => {
  describe('national number → E.164', () => {
    it('should prepend +91 to an Indian national number', () => {
      expect(prependDialCode('9876543210', 'IN')).toBe('+919876543210');
    });

    it('should prepend +1 to a US national number', () => {
      expect(prependDialCode('2025550199', 'US')).toBe('+12025550199');
    });

    it('should accept a numeric phoneNumber argument', () => {
      expect(prependDialCode(9876543210, 'IN')).toBe('+919876543210');
    });

    it('should strip formatting characters before prepending', () => {
      expect(prependDialCode('987-654-3210', 'IN')).toBe('+919876543210');
    });
  });

  describe('already-prefixed number → normalised E.164', () => {
    it('should return the number unchanged when the prefix matches the country', () => {
      expect(prependDialCode('+919876543210', 'IN')).toBe('+919876543210');
    });

    it('should normalise a US number that already carries +1', () => {
      expect(prependDialCode('+12025550199', 'US')).toBe('+12025550199');
    });

    it('should throw when the existing prefix does not match the country', () => {
      expect(() => prependDialCode('+12025550199', 'IN')).toThrow(
        /different dial code prefix/,
      );
    });
  });

  describe('invalid arguments', () => {
    it('should throw when phoneNumber is empty string', () => {
      expect(() => prependDialCode('', 'IN')).toThrow(/phoneNumber/);
    });

    it('should throw when countryCode is empty string', () => {
      expect(() => prependDialCode('9876543210', '' as any)).toThrow(
        /countryCode/,
      );
    });

    it('should throw when countryCode is invalid', () => {
      expect(() => prependDialCode('9876543210', 'XX' as any)).toThrow();
    });
  });
});
