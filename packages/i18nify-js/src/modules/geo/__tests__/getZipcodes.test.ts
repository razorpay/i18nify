import { StateType, CountryDetailType } from '../types';
import getZipcodes, { getZipcodesFromState } from '../getZipcodes';
import { INDIA_DATA } from '../mocks/country';

const generateZipcodes = (state: StateType) => {
  let zipcodes = Object.values(state.cities).reduce((acc: string[], city) => {
    return [...acc, ...city.zipcodes];
  }, [] as string[]);

  zipcodes = [...new Set(zipcodes)];
  return zipcodes;
};

const DL_ZIPCODES = generateZipcodes(INDIA_DATA.states.DL);
const NL_ZIPCODES = generateZipcodes(INDIA_DATA.states.NL);

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve<CountryDetailType>(INDIA_DATA),
  } as Response),
);

describe('getZipcodesFromState', () => {
  const mockCountryData: CountryDetailType = {
    country_name: 'Mock Country',
    states: {
      VALID_STATE: {
        name: 'Valid State',
        cities: {
          City1: {
            name: 'City1',
            zipcodes: ['12345'],
            timezone: 'Mock/Timezone',
            'region_name/district_name': 'Mock Region',
          },
        },
      },
    },
  };

  it('should throw an error if state code is not found', () => {
    const invalidStateCode = 'INVALID_STATE';
    expect(() =>
      getZipcodesFromState(mockCountryData, invalidStateCode),
    ).toThrow(`State with code ${invalidStateCode} not found.`);
  });
});

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
        `Invalid country code: XYZ. Please ensure you provide a valid country code.`,
      ),
    );
  });

  it('should reject with an error when state code is missing in a valid country', async () => {
    const validCountryCode = 'IN';
    const missingStateCode = 'XYZ';
    await expect(
      getZipcodes(validCountryCode, missingStateCode),
    ).rejects.toThrow(
      `An error occurred while fetching zipcode data. The error details are: State code ${missingStateCode} is missing in ${validCountryCode}. Please ensure you provide a valid state code that exists within the specified country. Check valid state codes and country codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/country/metadata/data.json.`,
    );
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getZipcodes('IN')).rejects.toThrow(
      'An error occurred while fetching zipcode data. The error details are: API Error.',
    );
  });
});
