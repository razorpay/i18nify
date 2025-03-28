import getDefaultLocaleList from '../getDefaultLocaleList';

describe('getDefaultLocaleList', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  it('fetches default locales for all countries correctly', async () => {
    const mockResponse = {
      metadata_information: {
        AF: { default_locale: 'fa_AF' },
        IN: { default_locale: 'en_IN' },
        US: { default_locale: 'en_US' },
        GB: { default_locale: 'en_GB' },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const defaultLocales = await getDefaultLocaleList();

    expect(defaultLocales).toEqual({
      AF: 'fa_AF',
      IN: 'en_IN',
      US: 'en_US',
      GB: 'en_GB',
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/country/metadata/data.json'),
    );
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    );

    await expect(getDefaultLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: HTTP error! status: 404.',
    );
  });

  it('handles network errors', async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error('Network error')));

    await expect(getDefaultLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: Network error.',
    );
  });

  it('handles invalid response format', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );

    await expect(getDefaultLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: Invalid response format: missing metadata_information.',
    );
  });

  it('handles empty metadata_information', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ metadata_information: {} }),
      }),
    );

    await expect(getDefaultLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: No default locales found in the response.',
    );
  });

  it('handles null default_locale values', async () => {
    const mockResponse = {
      metadata_information: {
        AF: { default_locale: null },
        IN: { default_locale: 'en_IN' },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const defaultLocales = await getDefaultLocaleList();

    expect(defaultLocales).toEqual({
      IN: 'en_IN',
    });
  });

  it('handles undefined default_locale values', async () => {
    const mockResponse = {
      metadata_information: {
        AF: { default_locale: undefined },
        IN: { default_locale: 'en_IN' },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const defaultLocales = await getDefaultLocaleList();

    expect(defaultLocales).toEqual({
      IN: 'en_IN',
    });
  });

  it('handles malformed JSON response', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error('Unexpected token <')),
      }),
    );

    await expect(getDefaultLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: Unexpected token <.',
    );
  });

  it('handles timeout errors', async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new Error('Timeout of 5000ms exceeded')),
      );

    await expect(getDefaultLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: Timeout of 5000ms exceeded.',
    );
  });

  it('handles CORS errors', async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(
          new Error(
            'Failed to fetch: NetworkError when attempting to fetch resource.',
          ),
        ),
      );

    await expect(getDefaultLocaleList()).rejects.toThrow(
      'An error occurred while fetching country metadata. The error details are: Failed to fetch: NetworkError when attempting to fetch resource.',
    );
  });
});
