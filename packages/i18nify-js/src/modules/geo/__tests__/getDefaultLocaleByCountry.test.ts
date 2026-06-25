import { CountryCodeType } from '../../types';
import getDefaultLocaleByCountry from '../getDefaultLocaleByCountry';
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

describe('getDefaultLocaleByCountry', () => {
  it('fetches country metadata correctly', async () => {
    const default_locale = await getDefaultLocaleByCountry('AF');
    expect(default_locale).toBe('fa_AF');
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(
      getDefaultLocaleByCountry('random' as CountryCodeType),
    ).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: undefined.',
    );
  });
});
