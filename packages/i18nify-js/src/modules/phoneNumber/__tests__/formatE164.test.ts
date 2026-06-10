import formatE164 from '../formatE164';

jest.mock('../getDialCodeByCountryCode', () =>
  jest.fn((code: string) => {
    const MAP: Record<string, string> = {
      IN: '+91',
      US: '+1',
      GB: '+44',
      DE: '+49',
      JP: '+81',
    };
    if (!(code in MAP)) throw new Error(`Invalid country code: ${code}`);
    return MAP[code];
  }),
);

describe('formatE164', () => {
  describe('national number input', () => {
    it('prepends calling code to a plain national number', () => {
      expect(formatE164('IN', '9876543210')).toBe('+919876543210');
    });

    it('strips spaces and dashes before formatting', () => {
      expect(formatE164('IN', '98765 43210')).toBe('+919876543210');
    });

    it('formats a US national number', () => {
      expect(formatE164('US', '6502530000')).toBe('+16502530000');
    });

    it('formats a GB national number', () => {
      expect(formatE164('GB', '7911123456')).toBe('+447911123456');
    });

    it('formats a DE number with separators', () => {
      // 030 includes the German trunk prefix 0; formatE164 does not strip
      // trunk prefixes — pass the national number without it.
      expect(formatE164('DE', '30 12345678')).toBe('+493012345678');
    });
  });

  describe('international prefix input', () => {
    it('normalises a number that already has the correct +prefix', () => {
      expect(formatE164('IN', '+91 98765 43210')).toBe('+919876543210');
    });

    it('normalises a US number with +1 prefix', () => {
      expect(formatE164('US', '+1-650-253-0000')).toBe('+16502530000');
    });
  });

  describe('error handling', () => {
    it('throws when countryCode does not match the +prefix', () => {
      expect(() => formatE164('IN', '+447911123456')).toThrow(
        'does not match country code "IN"',
      );
    });

    it('throws for missing phoneNumber', () => {
      expect(() => formatE164('IN', '')).toThrow("'phoneNumber' is invalid");
    });

    it('throws for missing countryCode', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => formatE164('' as any, '9876543210')).toThrow(
        "'countryCode' is invalid",
      );
    });

    it('throws for an unknown country code', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => formatE164('ZZ' as any, '9876543210')).toThrow(
        'Invalid country code: ZZ',
      );
    });
  });
});
