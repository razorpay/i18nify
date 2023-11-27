import parsePhoneNumber from '../parsePhoneNumber';

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
    });
  });

  it('should correctly parse a valid phone number without specifying country', () => {
    const phoneNumber = '+447123456789';

    const parsedInfo = parsePhoneNumber(phoneNumber);

    expect(parsedInfo.countryCode).toBeDefined();
    expect(parsedInfo.dialCode).toBeDefined();
    expect(parsedInfo.formattedPhoneNumber).toBeDefined();
    expect(parsedInfo.formatTemplate).toBeDefined();
  });

  it('should throw an error for an invalid phone number', () => {
    const phoneNumber = '+1969123456789';

    expect(() => parsePhoneNumber(phoneNumber)).toThrow(
      'Unable to detect `country code` from phone number.',
    );
  });

  it('should correctly parse a valid phone number with different country code', () => {
    const phoneNumber = '+61412123123'; // Australian phone number
    const country = 'AU'; // Expected country code

    const parsedInfo = parsePhoneNumber(phoneNumber, country);

    expect(parsedInfo).toEqual({
      countryCode: 'AU',
      formattedPhoneNumber: '+6 1412 123 123',
      dialCode: '+6',
      formatTemplate: 'xxxx xxx xxx',
    });
  });
});
