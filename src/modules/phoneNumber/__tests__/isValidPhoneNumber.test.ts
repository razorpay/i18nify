import { describe, expect, it } from '@jest/globals';
import isValidPhoneNumber from '../isValidPhoneNumber';

describe('isValidPhoneNumber', () => {
  const validTestDataSet = [
    { countryCode: 'IN', phoneNumber: '+917394926646' },
    { countryCode: 'MY', phoneNumber: '+60123456789' },
  ];

  const invalidTestDataSet = [
    { countryCode: 'IN', phoneNumber: '1234' },
    { countryCode: 'MY', phoneNumber: '60123' },
  ];

  validTestDataSet.map((dataset) => {
    it(`should validate a valid phone number for ${dataset.countryCode}`, () => {
      const isValid = isValidPhoneNumber(
        dataset.phoneNumber,
        dataset.countryCode,
      );
      expect(isValid).toBe(true);
    });
  });

  invalidTestDataSet.map((dataset) => {
    it(`should reject an invalid phone number for ${dataset.countryCode}`, () => {
      const isValid = isValidPhoneNumber(
        dataset.phoneNumber,
        dataset.countryCode,
      );
      expect(isValid).toBe(false);
    });
  });

  it('should handle a missing country code', () => {
    const phoneNumber = '1234567890';
    const countryCode = 'XYZ';
    const isValid = isValidPhoneNumber(phoneNumber, countryCode);
    expect(isValid).toBe(false);
  });

  it('should handle a missing phoneNumber', () => {
    const phoneNumber = '';
    const countryCode = 'MY';
    const isValid = isValidPhoneNumber(phoneNumber, countryCode);
    expect(isValid).toBe(false);
  });
});
