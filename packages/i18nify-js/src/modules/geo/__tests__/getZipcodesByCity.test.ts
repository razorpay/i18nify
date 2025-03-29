import { CountryDetailType } from '../types';
import getZipcodesByCity from '../getZipcodesByCity';
import { INDIA_DATA } from '../mocks/country';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve<CountryDetailType>(INDIA_DATA),
    } as Response),
  );
});

describe('getZipcodesByCity', () => {
  it('should return zipcodes for a valid country and city name', async () => {
    const validCountryCode = 'IN';
    const validCityName = 'New Delhi';
    const zipcodes = await getZipcodesByCity(validCountryCode, validCityName);

    expect(zipcodes).toEqual(INDIA_DATA.states.DL.cities['New Delhi'].zipcodes);
  });

  it('should return zipcodes when searching with a partial city name', async () => {
    const validCountryCode = 'IN';
    const partialCityName = 'East';
    const zipcodes = await getZipcodesByCity(validCountryCode, partialCityName);

    expect(zipcodes).toEqual(
      INDIA_DATA.states.DL.cities['East Delhi'].zipcodes,
    );
  });

  it('should handle case-insensitive city name matching', async () => {
    const validCountryCode = 'IN';
    const validCityName = 'NEW DELHI';
    const zipcodes = await getZipcodesByCity(validCountryCode, validCityName);

    expect(zipcodes).toEqual(INDIA_DATA.states.DL.cities['New Delhi'].zipcodes);
  });

  it('should handle case-insensitive partial city name matching', async () => {
    const validCountryCode = 'IN';
    const partialCityName = 'EAST';
    const zipcodes = await getZipcodesByCity(validCountryCode, partialCityName);

    expect(zipcodes).toEqual(
      INDIA_DATA.states.DL.cities['East Delhi'].zipcodes,
    );
  });

  it('should return zipcodes when searching with a specific city code', async () => {
    const validCountryCode = 'IN';
    const cityCode = 'East Delhi';
    const zipcodes = await getZipcodesByCity(validCountryCode, cityCode);

    expect(zipcodes).toEqual(
      INDIA_DATA.states.DL.cities['East Delhi'].zipcodes,
    );
  });

  it('should reject with an error message when country code is invalid', async () => {
    const invalidCountryCode = 'XYZ';
    const validCityName = 'New Delhi';

    await expect(
      // @ts-expect-error invalid country code for testing
      getZipcodesByCity(invalidCountryCode, validCityName),
    ).rejects.toEqual(
      new Error(
        `Invalid country code: XYZ. Please ensure you provide a valid country code.`,
      ),
    );
  });

  it('should reject with an error when city identifier is empty', async () => {
    const validCountryCode = 'IN';
    const emptyCityIdentifier = '';
    await expect(
      getZipcodesByCity(validCountryCode, emptyCityIdentifier),
    ).rejects.toEqual(
      new Error(
        'City identifier is required. Please provide a valid city name or city code.',
      ),
    );
  });

  it('should reject with an error when city identifier contains only whitespace', async () => {
    const validCountryCode = 'IN';
    const whitespaceCityIdentifier = '   ';
    await expect(
      getZipcodesByCity(validCountryCode, whitespaceCityIdentifier),
    ).rejects.toEqual(
      new Error(
        'City identifier is required. Please provide a valid city name or city code.',
      ),
    );
  });

  it('should return zipcodes when searching by city code', async () => {
    const validCountryCode = 'IN';
    const cityCode = 'Zunheboto';
    const zipcodes = await getZipcodesByCity(validCountryCode, cityCode);

    expect(zipcodes).toEqual(INDIA_DATA.states.NL.cities.Zunheboto.zipcodes);
  });

  it('should handle case-insensitive city code matching', async () => {
    const validCountryCode = 'IN';
    const cityCode = 'zunheboto';
    const zipcodes = await getZipcodesByCity(validCountryCode, cityCode);

    expect(zipcodes).toEqual(INDIA_DATA.states.NL.cities.Zunheboto.zipcodes);
  });

  it('should reject with an error when city identifier is not found in the country', async () => {
    const validCountryCode = 'IN';
    const invalidCityIdentifier = 'Invalid City';
    await expect(
      getZipcodesByCity(validCountryCode, invalidCityIdentifier),
    ).rejects.toThrow(
      `City with identifier "${invalidCityIdentifier}" not found in ${validCountryCode}. Please ensure you provide a valid city name or city code that exists within the specified country.`,
    );
  });

  it('handles API errors', async () => {
    const errorMessage = 'API Error';
    global.fetch = jest.fn(() => Promise.reject(errorMessage));
    await expect(getZipcodesByCity('IN', 'New Delhi')).rejects.toThrow(
      `An error occurred while fetching zipcode data. The error details are: ${errorMessage}.`,
    );
  });

  it('should handle city names with leading/trailing spaces', async () => {
    const validCountryCode = 'IN';
    const cityNameWithSpaces = '  New Delhi  ';
    const zipcodes = await getZipcodesByCity(
      validCountryCode,
      cityNameWithSpaces,
    );

    expect(zipcodes).toEqual(INDIA_DATA.states.DL.cities['New Delhi'].zipcodes);
  });

  it('should return first match when multiple cities match the partial name', async () => {
    const validCountryCode = 'IN';
    const partialName = 'Delhi';
    const zipcodes = await getZipcodesByCity(validCountryCode, partialName);

    // Should match the first occurrence (East Delhi)
    expect(zipcodes).toEqual(
      INDIA_DATA.states.DL.cities['East Delhi'].zipcodes,
    );
  });
});
