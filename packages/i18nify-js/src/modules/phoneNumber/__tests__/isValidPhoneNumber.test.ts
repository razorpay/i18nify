import PHONE_NUMBERS_JSON from './mocks/phoneNumbers.json';
import { isValidPhoneNumber } from '../index';
import { CountryCodeType } from '../../types';
import { PhoneNumbersMockData } from '../types';

describe('isValidPhoneNumber', () => {
  describe('standard validity checks', () => {
    const validTestDataSet = [
      { countryCode: 'IN', phoneNumber: '+917394926646' },
      { countryCode: 'MY', phoneNumber: '+60123456789' },
    ];

    const invalidTestDataSet = [
      { countryCode: 'IN', phoneNumber: '1234' },
      { countryCode: 'MY', phoneNumber: '60123' },
    ];

    validTestDataSet.forEach((dataset) => {
      it(`should validate a valid phone number for ${dataset.countryCode}`, () => {
        const isValid = isValidPhoneNumber(
          dataset.phoneNumber,
          dataset.countryCode as any,
        );
        expect(isValid).toBe(true);
      });
    });

    invalidTestDataSet.forEach((dataset) => {
      it(`should reject an invalid phone number for ${dataset.countryCode}`, () => {
        const isValid = isValidPhoneNumber(
          dataset.phoneNumber,
          dataset.countryCode as any,
        );
        expect(isValid).toBe(false);
      });
    });

    it('should handle a invalid country code and detect it from phone number to validate it', () => {
      const phoneNumber = '1234567890';
      const countryCode = 'XYZ';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(false);
    });

    it('should handle a missing phoneNumber', () => {
      const phoneNumber = '';
      const countryCode = 'MY';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(false);
    });

    it('should return false if the countryCode is not supported', () => {
      const unsupportedCountryCode = 'XXX';
      const phoneNumber = '+1234567890';
      const result = isValidPhoneNumber(
        phoneNumber,
        unsupportedCountryCode as any,
      );
      expect(result).toBe(false);
    });

    it('should handle phone number passed as a number', () => {
      const phoneNumber = 917394926646;
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(true);
    });

    it('should handle phone number with non-numeric characters', () => {
      const phoneNumber = '+91 (739) 492-6646';
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(true);
    });

    it('should handle empty or invalid phone number', () => {
      const countryCode = 'IN';
      const isValidEmpty = isValidPhoneNumber('', countryCode as any);
      const isValidNull = isValidPhoneNumber(null as any, countryCode as any);
      const isValidUndefined = isValidPhoneNumber(
        undefined as any,
        countryCode as any,
      );
      expect(isValidEmpty).toBe(false);
      expect(isValidNull).toBe(false);
      expect(isValidUndefined).toBe(false);
    });

    it('should fallback to detected country code when provided code is not in regex mapper', () => {
      const phoneNumber = '+917394926646';
      const countryCode = 'XX';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(true);
    });

    it('should handle both invalid phone number and country code', () => {
      const phoneNumber = '+999999999999';
      const countryCode = 'XX';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(false);
    });

    it('should handle valid country code but invalid phone number format', () => {
      const phoneNumber = '+91123'; // Too short for Indian number
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(false);
    });

    it('should handle phone number with special characters', () => {
      const phoneNumber = '+91 (739) 492-6646';
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(true);
    });

    it('should handle phone number with spaces and dashes', () => {
      const phoneNumber = '+91-739-492-6646';
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(true);
    });

    it('should handle empty country code', () => {
      const phoneNumber = '+917394926646';
      const countryCode = '';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(true);
    });

    it('should handle phone number with only special characters', () => {
      const phoneNumber = '()- ';
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(false);
    });

    it('should handle phone number with only plus symbol', () => {
      const phoneNumber = '+';
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(false);
    });

    it('should handle phone number without dial code but valid country code', () => {
      const phoneNumber = '7394926646';
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(true);
    });

    it('should handle phone number with only whitespace', () => {
      const phoneNumber = '   ';
      const countryCode = 'IN';
      const isValid = isValidPhoneNumber(phoneNumber, countryCode as any);
      expect(isValid).toBe(false);
    });
  });

  describe('validation against known data sets from https://fakenumber.in/', () => {
    const phoneNumbersData: PhoneNumbersMockData =
      PHONE_NUMBERS_JSON as PhoneNumbersMockData;
    Object.keys(phoneNumbersData).forEach((countryCode) => {
      it(`should match output for ${countryCode}`, () => {
        phoneNumbersData[countryCode].forEach(
          (data: { PhoneNumber: string; isValid: boolean }) => {
            expect(
              isValidPhoneNumber(
                data.PhoneNumber,
                countryCode as CountryCodeType,
              ),
            ).toBe(data.isValid);
          },
        );
      });
    });
  });
});
