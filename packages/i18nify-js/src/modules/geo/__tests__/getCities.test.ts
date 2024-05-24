import { CountryDetailType } from '../types';
import getCities from '../getCities';
import { DL_CITIES, INDIA_DATA, NL_CITIES } from '../mocks/country';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve<CountryDetailType>(INDIA_DATA),
  } as Response),
);

describe('getCities', () => {
  it('should return cities for a valid country and state code', async () => {
    const validCountryCode = 'IN';
    const validStateCode = 'DL';
    const cities = await getCities(validCountryCode, validStateCode);

    expect(cities).toEqual(DL_CITIES);
  });

  it('should return cities for all states for a valid country code', async () => {
    const validCountryCode = 'IN';
    const cities = await getCities(validCountryCode);

    expect(cities).toEqual([...DL_CITIES, ...NL_CITIES]);
  });

  it('should reject with an error message when country code is invalid', async () => {
    const invalidCountryCode = 'XYZ';
    // @ts-expect-error invalid country code for testing
    await expect(getCities(invalidCountryCode)).rejects.toEqual(
      `Invalid country code: ${invalidCountryCode}`,
    );
  });

  it('should reject with an error when state code is missing in a valid country', async () => {
    const validCountryCode = 'IN';
    const missingStateCode = 'XYZ';
    await expect(getCities(validCountryCode, missingStateCode)).rejects.toThrow(
      `State code ${missingStateCode} missing in ${validCountryCode}`,
    );
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getCities('IN')).rejects.toThrow('Error in API response');
  });
});
