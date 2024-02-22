import getFlagOfCountry from '../getFlagOfCountry';
import {LIST_OF_ALL_COUNTRIES} from '../data/listOfAllCountries';

describe('geo - getFlagOfCountry', () => {
  it('should return a correct URL for a valid country code', () => {
    const sampleValidCodes = ['US', 'GB', 'FR'];
    sampleValidCodes.forEach(code => {
      expect(getFlagOfCountry(code)).toEqual(`https://betacdn.np.razorpay.in/static/assets/flags/${code.toLowerCase()}.svg`);
    });
  });

  it('should throw an error for an invalid country code', () => {
    const sampleInvalidCodes = ['XX', 'ZZ', 'AA'];
    sampleInvalidCodes.forEach(code => {
      expect(() => getFlagOfCountry(code)).toThrow(`Invalid country code: ${code}`);
    });
  });

  it('should throw an error for an empty string', () => {
    expect(() => getFlagOfCountry('')).toThrow('Invalid country code: ');
  });

  it('should work for every code in the predefined list', () => {
    LIST_OF_ALL_COUNTRIES.forEach(code => {
      expect(getFlagOfCountry(code)).toEqual(`https://betacdn.np.razorpay.in/static/assets/flags/${code.toLowerCase()}.svg`);
    });
  });
});
