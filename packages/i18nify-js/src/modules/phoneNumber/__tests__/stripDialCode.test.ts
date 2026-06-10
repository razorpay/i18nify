import stripDialCode from '../stripDialCode';

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

describe('stripDialCode', () => {
  describe('strips dial code from E.164 number', () => {
    it('strips +91 from Indian number', () => {
      expect(stripDialCode('+919876543210', 'IN')).toBe('9876543210');
    });

    it('strips +1 from US number', () => {
      expect(stripDialCode('+16502530000', 'US')).toBe('6502530000');
    });

    it('strips +44 from GB number', () => {
      expect(stripDialCode('+447911123456', 'GB')).toBe('7911123456');
    });

    it('strips formatting characters before stripping dial code', () => {
      expect(stripDialCode('+91 98765 43210', 'IN')).toBe('9876543210');
    });

    it('strips dashes and spaces for US', () => {
      expect(stripDialCode('+1-650-253-0000', 'US')).toBe('6502530000');
    });
  });

  describe('national number passthrough', () => {
    it('returns national number unchanged when no + prefix', () => {
      expect(stripDialCode('9876543210', 'IN')).toBe('9876543210');
    });

    it('cleans non-numeric chars from national number', () => {
      expect(stripDialCode('98765 43210', 'IN')).toBe('9876543210');
    });
  });

  describe('error handling', () => {
    it('throws when +prefix does not match country dial code', () => {
      expect(() => stripDialCode('+447911123456', 'IN')).toThrow(
        'does not start with dial code +91',
      );
    });

    it('throws for missing phoneNumber', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => stripDialCode('' as any, 'IN')).toThrow(
        "'phoneNumber' is invalid",
      );
    });

    it('throws for missing countryCode', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => stripDialCode('+919876543210', '' as any)).toThrow(
        "'countryCode' is invalid",
      );
    });

    it('throws for unknown country code', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => stripDialCode('+999999999', 'ZZ' as any)).toThrow(
        'Invalid country code: ZZ',
      );
    });
  });
});
