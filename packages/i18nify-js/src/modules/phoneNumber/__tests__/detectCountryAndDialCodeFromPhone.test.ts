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
});