import { CityType, CountryDetailType } from '../types';
import getZipcodes from '../getZipcodes';
import { DL_CITIES, INDIA_DATA, NL_CITIES } from '../mocks/country';

const generateZipcodes = (cities: CityType[]) => {
  let zipcodes = cities.reduce((acc, curr) => {
    acc = [...acc, ...curr.zipcodes] as string[];
    return acc;
  }, [] as string[]);
  zipcodes = [...new Set(zipcodes)];
  return zipcodes;
};

const DL_ZIPCODES = generateZipcodes(DL_CITIES);
const NL_ZIPCODES = generateZipcodes(NL_CITIES);

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve<CountryDetailType>(INDIA_DATA),
  } as Response),
);

describe('getZipcodes', () => {
  it('should return zipcodes for a valid country and state code', async () => {
    const validCountryCode = 'IN';
    const validStateCode = 'DL';
    const zipcodes = await getZipcodes(validCountryCode, validStateCode);

    expect(zipcodes).toEqual(DL_ZIPCODES);
  });

  it('should return zipcodes for all states for a valid country code', async () => {
    const validCountryCode = 'IN';
    const zipcodes = await getZipcodes(validCountryCode);

    expect(zipcodes).toEqual([...DL_ZIPCODES, ...NL_ZIPCODES]);
  });

  it('should reject with an error message when country code is invalid', async () => {
    const invalidCountryCode = 'XYZ';
    // @ts-expect-error invalid country code for testing
    await expect(getZipcodes(invalidCountryCode)).rejects.toEqual(
      new Error(
        `Invalid country code: XYZ. Please ensure you provide a valid country code that is included in the supported list.`,
      ),
    );
  });

  it('should reject with an error when state code is missing in a valid country', async () => {
    const validCountryCode = 'IN';
    const missingStateCode = 'XYZ';
    await expect(
      getZipcodes(validCountryCode, missingStateCode),
    ).rejects.toThrow(
      `An error occurred while fetching zipcode data. The error details are: State code ${missingStateCode} is missing in ${validCountryCode}. Please ensure you provide a valid state code that exists within the specified country..`,
    );
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getZipcodes('IN')).rejects.toThrow(
      'An error occurred while fetching zipcode data. The error details are: API Error.',
    );
  });
});
