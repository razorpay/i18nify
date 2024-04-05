import { getTimeZoneByCountry } from '../index';
import { COUNTRIES_METADATA } from '../mocks/country';
import { CountryMetaType } from '../types';

type MockResponse = {
  metadata_information: Record<string, CountryMetaType>;
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve<MockResponse>(COUNTRIES_METADATA as any),
  } as Response),
);

describe('getTimeZoneByCountry', () => {
  it('fetches country metadata correctly', async () => {
    const timeZoneAF = await getTimeZoneByCountry('AF');
    expect(timeZoneAF).toBe('Asia/Kabul');

    const timeZoneIN = await getTimeZoneByCountry('IN');
    expect(timeZoneIN).toBe('Asia/Kolkata');
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getTimeZoneByCountry('XYZ')).rejects.toThrow(
      'Error in API response',
    );
  });
});
