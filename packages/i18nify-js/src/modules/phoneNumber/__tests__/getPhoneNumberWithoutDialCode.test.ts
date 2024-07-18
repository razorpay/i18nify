import { getPhoneNumberWithoutDialCode } from '../utils';

describe('getPhoneNumberWithoutDialCode', () => {
  test('should correctly remove the dial code from a phone number', () => {
    const phoneNumber = '+1-800-123-4567';
    const result = getPhoneNumberWithoutDialCode(phoneNumber);

    expect(result).toBe('8001234567');
  });

  test('should return the phone number unchanged if no dial code is present', () => {
    const phoneNumber = '7394 926646';
    const result = getPhoneNumberWithoutDialCode(phoneNumber);
    expect(result).toBe('7394926646');
  });

  test('should handle international phone numbers', () => {
    const phoneNumber = '+44 7911 123456';
    const result = getPhoneNumberWithoutDialCode(phoneNumber);
    expect(result).toBe('7911123456');
  });

  test('should process numbers with unusual dial codes', () => {
    const phoneNumber = '+91-9876543210';
    const result = getPhoneNumberWithoutDialCode(phoneNumber);
    expect(result).toBe('9876543210');
  });
});
