import { getFlagOfCountry } from '../index';
import { COUNTRY_LIST_FOR_ALL_FLAGS } from '../data/countryListForAllFlags';
import { FLAG_4X3_BASE_PATH, FLAG_BASE_PATH } from '../constants';
import { CountryCodeTypeForAllFlags } from '../../types';

describe('geo - getFlagOfCountry', () => {
  it('should return a correct URL for a valid country code', () => {
    const sampleValidCodes = ['US', 'GB', 'FR'];
    sampleValidCodes.forEach((code) => {
      expect(getFlagOfCountry(code as CountryCodeTypeForAllFlags)).toEqual({
        original: `${FLAG_BASE_PATH}/${code.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${code.toLowerCase()}.svg`,
      });
    });
  });

  it('should throw an error for an invalid country code', () => {
    const sampleInvalidCodes = 'XX';
    expect(() =>
      getFlagOfCountry(sampleInvalidCodes as CountryCodeTypeForAllFlags),
    ).toThrow(`Invalid country code: ${sampleInvalidCodes}`);
  });

  it('should throw an error for an empty string', () => {
    expect(() => getFlagOfCountry('' as CountryCodeTypeForAllFlags)).toThrow(
      'Invalid country code: ',
    );
  });

  it('should work for every code in the predefined list', () => {
    COUNTRY_LIST_FOR_ALL_FLAGS.forEach((code) => {
      expect(getFlagOfCountry(code)).toEqual({
        original: `${FLAG_BASE_PATH}/${code.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${code.toLowerCase()}.svg`,
      });
    });
  });
});
