import { getTimezoneList } from '../index';
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

describe('getTimezoneList', () => {
  it('fetches country metadata correctly', async () => {
    const expectedTimezoneListObj = {
      AF: {
        timezone_of_capital: 'Asia/Kabul',
        timezones: {
          'Asia/Kabul': {
            utc_offset: 'UTC +04:30',
          },
        },
      },
      IN: {
        timezone_of_capital: 'Asia/Kolkata',
        timezones: {
          'Asia/Kolkata': {
            utc_offset: 'UTC +05:30',
          },
        },
      },
    };
    const timeZoneList = await getTimezoneList();
    expect(timeZoneList).toEqual(expectedTimezoneListObj);
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getTimezoneList()).rejects.toThrow('Error in API response');
  });
});
