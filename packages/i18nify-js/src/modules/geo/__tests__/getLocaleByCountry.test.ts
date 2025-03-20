import { CountryCodeType } from '../../types';
import getLocaleByCountry from '../getLocaleByCountry';
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

global.fetch = jest.fn(mockFetch);

describe('getLocaleByCountry', () => {
  it('handles invalid country code', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ metadata_information: {} }),
      } as Response),
    );
    await expect(
      getLocaleByCountry('INVALID' as CountryCodeType),
    ).rejects.toThrow('An error occurred while fetching country locales.');
  });

  it('handles empty locales data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            metadata_information: {
              IN: { locales: {} },
            },
          }),
      } as Response),
    );
    const locales = await getLocaleByCountry('IN');
    expect(Array.isArray(locales)).toBe(true);
    expect(locales).toHaveLength(0);
  });

  it('handles malformed API response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ invalid_key: {} }),
      } as Response),
    );
    await expect(getLocaleByCountry('IN')).rejects.toThrow(
      'An error occurred while fetching country locales.',
    );
  });

  it('handles network timeout', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network timeout')));
    await expect(getLocaleByCountry('IN')).rejects.toThrow(
      'An error occurred while fetching country locales. The error details are: Network timeout.',
    );
  });
});

it('handles API errors', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));
  await expect(getLocaleByCountry('random' as CountryCodeType)).rejects.toThrow(
    'An error occurred while fetching country locales. The error details are: API Error.',
  );
});

it('fetches country locales correctly', async () => {
  global.fetch = jest.fn(mockFetch);
  const locales = await getLocaleByCountry('IN');
  expect(Array.isArray(locales)).toBe(true);
  expect(locales).toContain('en_IN');
  expect(locales).toContain('hi');
  expect(locales).toContain('bn');
});

afterEach(() => {
  jest.resetAllMocks();
});
