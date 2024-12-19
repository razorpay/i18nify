import { CountryCodeType } from '../../types';
import getByCountry from '../getByCountry';
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

describe('getByCountry', () => {
  it('fetches country metadata correctly', async () => {
    const countries = await getByCountry('AF');
    expect(countries).toHaveProperty('country_name');
    expect(countries.country_name).toBe('Afghanistan');
    expect(countries.alpha_3).toBe('AFG');
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getByCountry('random' as CountryCodeType)).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: undefined.',
    );
  });
});
