import getCountriesByTimezone from '../getCountriesByTimezone';
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

beforeEach(() => {
  global.fetch = jest.fn(mockFetch);
});

describe('getCountriesByTimezone', () => {
  it('returns matching countries for an IANA timezone name', async () => {
    const countries = await getCountriesByTimezone('Asia/Kolkata');
    expect(countries).toContain('IN');
  });

  it('returns matching countries for a UTC offset string (+HH:MM)', async () => {
    const countries = await getCountriesByTimezone('+05:30');
    expect(countries).toContain('IN');
  });

  it('returns matching countries for a UTC offset string with "UTC" prefix', async () => {
    const countries = await getCountriesByTimezone('UTC +04:30');
    expect(countries).toContain('AF');
  });

  it('returns an empty array when no country matches the timezone', async () => {
    const countries = await getCountriesByTimezone('Pacific/Fakezone');
    expect(countries).toEqual([]);
  });

  it('returns an empty array for a UTC offset that matches no country', async () => {
    const countries = await getCountriesByTimezone('+13:45');
    expect(countries).toEqual([]);
  });

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network failure')));
    await expect(getCountriesByTimezone('Asia/Kolkata')).rejects.toThrow(
      'An error occurred while fetching timezone to country mapping. The error details are: Network failure.',
    );
  });

  it('throws when timezone argument is empty', () => {
    expect(() => getCountriesByTimezone('')).toThrow(
      'timezone parameter is required and must not be empty.',
    );
  });

  it('throws when timezone argument is whitespace only', () => {
    expect(() => getCountriesByTimezone('   ')).toThrow(
      'timezone parameter is required and must not be empty.',
    );
  });
});
