import { parsePhoneNumber } from '../index';

describe('parsePhoneNumber function', () => {
  it('should correctly parse a valid phone number with country code', () => {
    const phoneNumber = '+15853042806';
    const country = 'US';

    const parsedInfo = parsePhoneNumber(phoneNumber, country);

    expect(parsedInfo).toEqual({
      countryCode: 'US',
      dialCode: '+1',
      formattedPhoneNumber: '+1 585-304-2806',
      formatTemplate: 'xxx-xxx-xxxx',
      phoneNumber: '5853042806',
    });
  });

  it('should correctly parse a valid phone number without specifying country', () => {
    const phoneNumber = '+447123456789';

    const parsedInfo = parsePhoneNumber(phoneNumber);

    expect(parsedInfo.countryCode).toBe('GB');
    expect(parsedInfo.dialCode).toBe('+44');
    expect(parsedInfo.formattedPhoneNumber).toBe('+44 7123 456 789');
    expect(parsedInfo.formatTemplate).toBe('xxxx xxx xxx');
    expect(parsedInfo.phoneNumber).toBe('7123456789');
  });

  it('should return unformatted number for invalid phone number', () => {
    const phoneNumber = '+1969123456789';

    const parsedInfo = parsePhoneNumber(phoneNumber);

    expect(parsedInfo.countryCode).toBe('');
    expect(parsedInfo.dialCode).toBe('');
    expect(parsedInfo.formattedPhoneNumber).toBe('+1969123456789');
    expect(parsedInfo.formatTemplate).toBe('');
    expect(parsedInfo.phoneNumber).toBe('+1969123456789');
  });

  it('should throw error if phone number is not passed as empty string', () => {
    const phoneNumber = '';

    expect(() => parsePhoneNumber(phoneNumber)).toThrow(
      "Error: Parameter 'phoneNumber' is invalid! The received value was: . Please ensure you provide a valid phone number.",
    );
  });
});
