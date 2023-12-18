import { detectCountryCodeFromDialCode } from '../utils';

describe('detectCountryCodeFromDialCode', () => {
  it('should detect country code for valid phone numbers', () => {
    expect(detectCountryCodeFromDialCode('+919876543210')).toBe('IN');
    expect(detectCountryCodeFromDialCode('60123456789')).toBe('MY');
    expect(detectCountryCodeFromDialCode('+12125551234')).toBe('US');
  });

  it('should throw an error for invalid phone numbers', () => {
    expect(detectCountryCodeFromDialCode('123')).toBe('');
  });
});
