import getAllCountries from '../getAllCountries';
import { COUNTRIES_METADATA } from '../mocks/country';
import { CountryMetaType } from '../types';

type MockResponse = {
  metadata_information: Record<string, CountryMetaType>;
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve<MockResponse>(COUNTRIES_METADATA),
  } as Response),
);

describe('getAllCountries', () => {
  it('fetches country metadata correctly', async () => {
    const countries = await getAllCountries();
    expect(countries).toHaveProperty('AF');
    expect(countries.AF.country_name).toBe('Afghanistan');
    expect(countries).toHaveProperty('IN');
    expect(countries.IN.country_name).toBe('India');
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getAllCountries()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: undefined.',
    );
  });
});
