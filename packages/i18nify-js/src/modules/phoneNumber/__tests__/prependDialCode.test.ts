import prependDialCode from '../prependDialCode';

jest.mock('../getDialCodeByCountryCode', () =>
  jest.fn((code: string) => {
    const MAP: Record<string, string> = {
      IN: '+91',
      US: '+1',
      GB: '+44',
      DE: '+49',
    };
    if (!(code in MAP)) throw new Error(`Invalid country code: ${code}`);
    return MAP[code];
  }),
);

describe('prependDialCode', () => {
  describe('national number input', () => {
    it('prepends +91 to Indian national number', () => {
      expect(prependDialCode('9876543210', 'IN')).toBe('+919876543210');
    });

    it('prepends +1 to US national number', () => {
      expect(prependDialCode('6502530000', 'US')).toBe('+16502530000');
    });

    it('prepends +44 to GB national number', () => {
      expect(prependDialCode('7911123456', 'GB')).toBe('+447911123456');
    });

    it('strips formatting characters before prepending', () => {
      expect(prependDialCode('98765 43210', 'IN')).toBe('+919876543210');
    });

    it('strips dashes and spaces for DE', () => {
      expect(prependDialCode('30 12345678', 'DE')).toBe('+493012345678');
    });
  });

  describe('already-prefixed number', () => {
    it('returns normalised number when correct +prefix already present', () => {
      expect(prependDialCode('+91 98765 43210', 'IN')).toBe('+919876543210');
    });

    it('normalises a US number with +1 prefix and dashes', () => {
      expect(prependDialCode('+1-650-253-0000', 'US')).toBe('+16502530000');
    });
  });

  describe('error handling', () => {
    it('throws when +prefix does not match country dial code', () => {
      expect(() => prependDialCode('+447911123456', 'IN')).toThrow(
        'different dial code prefix',
      );
    });

    it('throws for missing phoneNumber', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => prependDialCode('' as any, 'IN')).toThrow(
        "'phoneNumber' is invalid",
      );
    });

    it('throws for missing countryCode', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => prependDialCode('9876543210', '' as any)).toThrow(
        "'countryCode' is invalid",
      );
    });

    it('throws for unknown country code', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => prependDialCode('9876543210', 'ZZ' as any)).toThrow(
        'Invalid country code: ZZ',
      );
    });
  });
});
