import getLocaleList from '../getLocaleList';
import { I18NIFY_DATA_SOURCE } from '../../shared';
import { CountryCodeType } from '../../types';

describe('getLocaleList', () => {
  const mockResponse = {
    metadata_information: {
      IN: {
        locales: {
          hi_IN: { name: 'Hindi' },
          en_IN: { name: 'English' },
        },
      },
      US: {
        locales: {
          en_US: { name: 'English' },
        },
      },
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches all locales when no country code is provided', async () => {
    const localeList = await getLocaleList();
    expect(global.fetch).toHaveBeenCalledWith(
      `${I18NIFY_DATA_SOURCE}/country/metadata/data.json`,
    );
    expect(localeList).toEqual({
      IN: mockResponse.metadata_information.IN.locales,
      US: mockResponse.metadata_information.US.locales,
    });
  });

  it('fetches locales for a specific country when country code is provided', async () => {
    const localeList = await getLocaleList('IN');
    expect(global.fetch).toHaveBeenCalledWith(
      `${I18NIFY_DATA_SOURCE}/country/metadata/data.json`,
    );
    expect(localeList).toEqual(mockResponse.metadata_information.IN.locales);
  });

  it('handles API errors correctly', async () => {
    const errorMessage = 'Network error';
    global.fetch = jest.fn(() =>
      Promise.reject(new Error(errorMessage)),
    ) as jest.Mock;

    await expect(getLocaleList()).rejects.toThrow(
      `An error occurred while fetching country metadata. The error details are: ${errorMessage}.`,
    );
  });

  it('handles invalid country code', async () => {
    const invalidCountryCode = 'XX' as CountryCodeType;
    await expect(getLocaleList(invalidCountryCode)).rejects.toThrow(
      'An error occurred while fetching country metadata.',
    );
  });

  it('handles empty response data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ metadata_information: {} }),
      }),
    ) as jest.Mock;

    const localeList = await getLocaleList();
    expect(localeList).toEqual({});
  });

  it('handles malformed response data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ invalid_key: {} }),
      }),
    ) as jest.Mock;

    await expect(getLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata.',
    );
  });
});
