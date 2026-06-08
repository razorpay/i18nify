import { formatToE164 } from '../index';

describe('formatToE164', () => {
  it('normalises a number that already carries a dial code', () => {
    expect(formatToE164('+917394926646')).toBe('+917394926646');
  });

  it('strips formatting characters from a number with a dial code', () => {
    expect(formatToE164('+1 (201) 555-1234')).toBe('+12015551234');
  });

  it('prepends dial code when countryCode is provided and number has no prefix', () => {
    expect(formatToE164('7394926646', 'IN')).toBe('+917394926646');
  });

  it('returns E.164 for a US number with country code', () => {
    expect(formatToE164('2015551234', 'US')).toBe('+12015551234');
  });

  it('passes through a number that already starts with + even when countryCode is given', () => {
    expect(formatToE164('+917394926646', 'IN')).toBe('+917394926646');
  });

  it('throws for an empty phone number', () => {
    expect(() => formatToE164('')).toThrow(
      "Error: Parameter 'phoneNumber' is invalid!",
    );
  });

  it('throws when no dial code and no countryCode provided', () => {
    expect(() => formatToE164('7394926646')).toThrow(
      'Unable to determine dial code',
    );
  });

  it('throws for an invalid country code', () => {
    expect(() => formatToE164('7394926646', 'XX' as any)).toThrow();
  });
});
