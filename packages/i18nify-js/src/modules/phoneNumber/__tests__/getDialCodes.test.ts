import { CountryCodeType } from '../../types/geo';
import getDialCodes from '../getDialCodes';

describe('phoneNumber - getDialCodes', () => {
  it('should correctly map country codes to their dial codes', () => {
    const result = getDialCodes();
    const expectedMappings = {
      US: '+1',
      RU: '+7',
      IN: '+91',
    };

    for (const [countryCode, dialCode] of Object.entries(expectedMappings)) {
      expect(result[countryCode as CountryCodeType]).toBe(dialCode);
    }
  });
});
