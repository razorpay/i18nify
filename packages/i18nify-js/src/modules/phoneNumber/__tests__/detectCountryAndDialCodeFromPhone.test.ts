import { detectCountryAndDialCodeFromPhone } from '../utils';

describe('detectCountryAndDialCodeFromPhone', () => {
  it('should detect country code for valid phone numbers', () => {
    expect(detectCountryAndDialCodeFromPhone('+919876543210')).toEqual({
      countryCode: 'IN',
      dialCode: '+91',
    });
    expect(detectCountryAndDialCodeFromPhone('60123456789')).toEqual({
      countryCode: 'MY',
      dialCode: '+60',
    });
    expect(detectCountryAndDialCodeFromPhone('+12125551234')).toEqual({
      countryCode: 'US',
      dialCode: '+1',
    });
  });

  it('should throw an error for invalid phone numbers', () => {
    expect(detectCountryAndDialCodeFromPhone('123')).toEqual({
      countryCode: '',
      dialCode: '',
    });
  });

  it('should correctly detect the country code and dial code for a UK number with plus', () => {
    expect(detectCountryAndDialCodeFromPhone('+447911123456')).toEqual({
      countryCode: 'GB',
      dialCode: '+44',
    });
  });

  it('should handle phone numbers with spaces and dashes after cleaning', () => {
    expect(detectCountryAndDialCodeFromPhone('+12025550178')).toEqual({
      // Removed spaces and dashes
      countryCode: 'US',
      dialCode: '+1',
    });
  });

  it('should return empty strings for a number too short to be valid', () => {
    expect(detectCountryAndDialCodeFromPhone('+12345')).toEqual({
      // Added a '+' to indicate an attempt at an international number
      countryCode: '',
      dialCode: '',
    });
  });
});
