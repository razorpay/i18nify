import { CountryCodeType } from '../../shared/types';
import { DIAL_CODE_MAPPER } from '../data/dialCodeMapper';
import { getDialCodeFromCountryCode } from '../utils';

describe('getDialCodeFromCountryCode', () => {
  it('should return the correct dial code for a valid country code', () => {
    expect(getDialCodeFromCountryCode('US')).toBe('1');
    expect(getDialCodeFromCountryCode('GB')).toBe('44');
    expect(getDialCodeFromCountryCode('DE')).toBe('49');
  });

  it('should return an empty string for an invalid country code', () => {
    expect(getDialCodeFromCountryCode('XYZ' as CountryCodeType)).toBe('');
  });

  it('should be case-insensitive', () => {
    expect(getDialCodeFromCountryCode('us' as CountryCodeType)).toBe('1');
    expect(getDialCodeFromCountryCode('gb' as CountryCodeType)).toBe('44');
  });

  it('should return the correct dial code for countries with shared codes', () => {
    expect(getDialCodeFromCountryCode('CA')).toBe('1'); // Canada shares dial code 1 with the US and others
    expect(getDialCodeFromCountryCode('RU')).toBe('7'); // Russia shares dial code 7 with Kazakhstan
  });

  it('should return an empty string for empty or whitespace-only input', () => {
    expect(getDialCodeFromCountryCode('' as CountryCodeType)).toBe('');
    expect(getDialCodeFromCountryCode(' ' as CountryCodeType)).toBe('');
  });

  it('should return a valid dial code for every country code in DIAL_CODE_MAPPER', () => {
    Object.values(DIAL_CODE_MAPPER)
      .flat()
      .forEach((countryCode) => {
        const dialCode = getDialCodeFromCountryCode(countryCode);
        expect(dialCode).toMatch(/^\d+$/);
      });
  });
});
