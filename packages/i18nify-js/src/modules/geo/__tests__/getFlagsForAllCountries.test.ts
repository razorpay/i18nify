import { getFlagsForAllCountries } from '../index';
import { COUNTRY_LIST_FOR_ALL_FLAGS } from '../data/countryListForAllFlags';
import { FLAG_4X3_BASE_PATH, FLAG_BASE_PATH } from '../constants';
import { CountryCodeTypeForAllFlags } from '../../types';

describe('geo - getFlagsForAllCountries', () => {
  it('should return an object', () => {
    const flagsMap = getFlagsForAllCountries();
    expect(typeof flagsMap).toBe('object');
  });

  it('should contain all predefined country codes as keys', () => {
    const flagsMap = getFlagsForAllCountries();
    COUNTRY_LIST_FOR_ALL_FLAGS.forEach((countryCode) => {
      expect(flagsMap).toHaveProperty(countryCode);
    });
  });

  it('should map each country code to a correctly formed flag URL', () => {
    const flagsMap = getFlagsForAllCountries();
    COUNTRY_LIST_FOR_ALL_FLAGS.forEach((countryCode) => {
      const expectedObject = {
        original: `${FLAG_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
      };
      expect(flagsMap[countryCode]).toEqual(expectedObject);
    });
  });

  it('should have an entry for each country code in the predefined list', () => {
    const flagsMap = getFlagsForAllCountries();
    expect(Object.keys(flagsMap).length).toEqual(
      COUNTRY_LIST_FOR_ALL_FLAGS.length,
    );
  });

  it('should correctly map specific country codes to their flag URLs', () => {
    const flagsMap = getFlagsForAllCountries();
    const testCases = ['US', 'GB', 'FR'];
    testCases.forEach((countryCode) => {
      const expectedObject = {
        original: `${FLAG_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
      };
      expect(flagsMap[countryCode as CountryCodeTypeForAllFlags]).toEqual(
        expectedObject,
      );
    });
  });
});
