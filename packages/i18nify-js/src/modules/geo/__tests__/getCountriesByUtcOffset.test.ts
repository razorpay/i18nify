import getCountriesByUtcOffset from '../getCountriesByUtcOffset';
import { COUNTRIES_METADATA } from '../mocks/country';
import { CountryMetaType } from '../types';

type MockResponse = {
  metadata_information: Record<string, CountryMetaType>;
};

const mockFetch = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve<MockResponse>(COUNTRIES_METADATA),
  } as Response);

describe('getCountriesByUtcOffset', () => {
  beforeEach(() => {
    global.fetch = jest.fn(mockFetch);
  });

  it('returns countries matching the given UTC offset (canonical format)', async () => {
    const countries = await getCountriesByUtcOffset('UTC +05:30');
    expect(Array.isArray(countries)).toBe(true);
    expect(countries).toContain('IN');
  });

  it('returns countries when offset is supplied without the "UTC " prefix', async () => {
    const countries = await getCountriesByUtcOffset('+05:30');
    expect(Array.isArray(countries)).toBe(true);
    expect(countries).toContain('IN');
  });

  it('returns countries for Afghanistan offset', async () => {
    const countries = await getCountriesByUtcOffset('UTC +04:30');
    expect(countries).toContain('AF');
  });

  it('returns an empty array when no country has the given offset', async () => {
    const countries = await getCountriesByUtcOffset('+99:99');
    expect(countries).toEqual([]);
  });

  it('throws on an invalid offset format', async () => {
    await expect(getCountriesByUtcOffset('invalid')).rejects.toThrow(
      'Invalid UTC offset format',
    );
  });

  it('throws when the API call fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network failure')));
    await expect(getCountriesByUtcOffset('+05:30')).rejects.toThrow(
      'An error occurred while fetching countries for UTC offset',
    );
  });

  it('handles negative offsets correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            metadata_information: {
              US: {
                country_name: 'United States',
                continent_code: 'NA',
                continent_name: 'North America',
                alpha_3: 'USA',
                numeric_code: '840',
                flag: '',
                sovereignty: 'UN member state',
                dial_code: '+1',
                supported_currency: ['USD'],
                timezones: {
                  'America/New_York': { utc_offset: 'UTC -05:00' },
                  'America/Chicago': { utc_offset: 'UTC -06:00' },
                },
                timezone_of_capital: 'America/New_York',
                locales: { en_US: { name: 'English (United States)' } },
                default_locale: 'en_US',
                default_currency: 'USD',
              },
            },
          }),
      } as Response),
    );
    const countries = await getCountriesByUtcOffset('UTC -05:00');
    expect(countries).toContain('US');
    const countriesNeg6 = await getCountriesByUtcOffset('-06:00');
    expect(countriesNeg6).toContain('US');
  });
});
