import { getFlagsForAllCountries } from '../index';
import { LIST_OF_ALL_COUNTRIES } from '../data/listOfAllCountries';
import {
  FLAG_4X3_BASE_PATH,
  FLAG_BASE_PATH,
} from '../../shared/sourceConstants';
import { CountryCodeType } from '../../types';

describe('geo - getFlagsForAllCountries', () => {
  it('should return an object', () => {
    const flagsMap = getFlagsForAllCountries();
    expect(typeof flagsMap).toBe('object');
  });

  it('should contain all predefined country codes as keys', () => {
    const flagsMap = getFlagsForAllCountries();
    LIST_OF_ALL_COUNTRIES.forEach((countryCode) => {
      expect(flagsMap).toHaveProperty(countryCode);
    });
  });

  it('should map each country code to a correctly formed flag URL', () => {
    const flagsMap = getFlagsForAllCountries();
    LIST_OF_ALL_COUNTRIES.forEach((countryCode) => {
      const expectedObject = {
        original: `${FLAG_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
      };
      expect(flagsMap[countryCode]).toEqual(expectedObject);
    });
  });

  it('should have an entry for each country code in the predefined list', () => {
    const flagsMap = getFlagsForAllCountries();
    expect(Object.keys(flagsMap).length).toEqual(LIST_OF_ALL_COUNTRIES.length);
  });

  it('should correctly map specific country codes to their flag URLs', () => {
    const flagsMap = getFlagsForAllCountries();
    const testCases = ['US', 'GB', 'FR'];
    testCases.forEach((countryCode) => {
      const expectedObject = {
        original: `${FLAG_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${countryCode.toLowerCase()}.svg`,
      };
      expect(flagsMap[countryCode as CountryCodeType]).toEqual(expectedObject);
    });
  });
});
