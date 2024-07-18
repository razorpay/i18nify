import { getFlagOfCountry } from '../index';
import { LIST_OF_ALL_COUNTRIES } from '../data/listOfAllCountries';
import { FLAG_4X3_BASE_PATH, FLAG_BASE_PATH } from '../constants';
import { CountryCodeType } from '../../types';

describe('geo - getFlagOfCountry', () => {
  it('should return a correct URL for a valid country code', () => {
    const sampleValidCodes = ['US', 'GB', 'FR'];
    sampleValidCodes.forEach((code) => {
      expect(getFlagOfCountry(code as CountryCodeType)).toEqual({
        original: `${FLAG_BASE_PATH}/${code.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${code.toLowerCase()}.svg`,
      });
    });
  });

  it('should throw an error for an invalid country code', () => {
    const sampleInvalidCodes = 'XX';
    expect(() =>
      getFlagOfCountry(sampleInvalidCodes as CountryCodeType),
    ).toThrow(`Invalid country code: ${sampleInvalidCodes}`);
  });

  it('should throw an error for an empty string', () => {
    expect(() => getFlagOfCountry('' as CountryCodeType)).toThrow(
      'Invalid country code: ',
    );
  });

  it('should work for every code in the predefined list', () => {
    LIST_OF_ALL_COUNTRIES.forEach((code) => {
      expect(getFlagOfCountry(code)).toEqual({
        original: `${FLAG_BASE_PATH}/${code.toLowerCase()}.svg`,
        '4X3': `${FLAG_4X3_BASE_PATH}/${code.toLowerCase()}.svg`,
      });
    });
  });
});
