import { cleanPhoneNumber } from '../utils';

describe('cleanPhoneNumber', () => {
  it('should remove non-numeric characters from a phone number', () => {
    const phoneNumber = '+1 (123)-456-7890'; // Phone number with various non-numeric characters

    const cleanedNumber = cleanPhoneNumber(phoneNumber);

    expect(cleanedNumber).toBe('+11234567890'); // Expecting only numeric characters and '+' at the start
  });

  it('should handle an already clean phone number without non-numeric characters', () => {
    const phoneNumber = '+9876543210'; // Clean phone number without non-numeric characters

    const cleanedNumber = cleanPhoneNumber(phoneNumber);

    expect(cleanedNumber).toBe('+9876543210'); // Expecting no change in the phone number
  });

  it('should handle an empty phone number string', () => {
    const phoneNumber = '';

    const cleanedNumber = cleanPhoneNumber(phoneNumber);

    expect(cleanedNumber).toBe('');
  });

  it('should handle a phone number starting with non-numeric characters', () => {
    const phoneNumber = 'abc+123456789'; // Phone number starting with non-numeric characters

    const cleanedNumber = cleanPhoneNumber(phoneNumber);

    expect(cleanedNumber).toBe('123456789'); // Expecting non-numeric characters at the start to be removed, will also remove + as it is not the starting character
  });

  it('should handle a phone number with only non-numeric characters', () => {
    const phoneNumber = '---'; // Phone number with only non-numeric characters

    const cleanedNumber = cleanPhoneNumber(phoneNumber);

    expect(cleanedNumber).toBe('');
  });
});
