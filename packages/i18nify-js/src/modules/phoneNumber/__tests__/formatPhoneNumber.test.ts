import { formatPhoneNumber } from '../index';

describe('formatPhoneNumber', () => {
  it('should format an Indian phone number', () => {
    const phoneNumber = '+917394926646';
    const countryCode = 'IN';
    const formatted = formatPhoneNumber(phoneNumber, countryCode);
    expect(formatted).toBe('+91 7394 926646');
  });

  it('should format a Malaysian phone number', () => {
    const phoneNumber = '+60123456789';
    const countryCode = 'MY';
    const formatted = formatPhoneNumber(phoneNumber, countryCode);
    expect(formatted).toBe('+60 12 34567 89');
  });

  it('should handle a invalid country code and detect it from phone number to format', () => {
    const phoneNumber = '+917394926646';
    const countryCode = 'XYZ';
    const formatted = formatPhoneNumber(phoneNumber, countryCode as any);
    expect(formatted).toBe('+91 7394 926646');
  });

  it('should handle a missing phoneNumber', () => {
    const phoneNumber = '';
    const countryCode = 'MY';
    expect(() => formatPhoneNumber(phoneNumber, countryCode)).toThrow(
      'Parameter `phoneNumber` is invalid!',
    );
  });
});
