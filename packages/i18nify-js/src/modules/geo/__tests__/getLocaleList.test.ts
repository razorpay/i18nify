import getLocaleList from '../getLocaleList';
import { I18NIFY_DATA_SOURCE } from '../../shared';

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

  it('fetches all locales successfully', async () => {
    const localeList = await getLocaleList();
    expect(global.fetch).toHaveBeenCalledWith(
      `${I18NIFY_DATA_SOURCE}/country/metadata/data.json`,
    );
    expect(localeList).toEqual({
      IN: ['hi_IN', 'en_IN'],
      US: ['en_US'],
    });
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
