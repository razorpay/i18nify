import getTimeZoneByCountry from '../getTimeZoneByCountry';

const MOCK_METADATA = {
  metadata_information: {
    IN: {
      timezones: {
        'Asia/Kolkata': { utc_offset: 'UTC +05:30' },
      },
    },
    US: {
      timezones: {
        'America/New_York': { utc_offset: 'UTC -05:00' },
        'America/Chicago': { utc_offset: 'UTC -06:00' },
        'America/Denver': { utc_offset: 'UTC -07:00' },
        'America/Los_Angeles': { utc_offset: 'UTC -08:00' },
      },
    },
    NO_TZ: {
      timezones: {},
    },
  },
};

const mockFetch = (data: object, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? 'OK' : 'Internal Server Error',
      json: () => Promise.resolve(data),
    } as Response),
  );
};

describe('getTimeZoneByCountry', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns timezone data for a single-timezone country', async () => {
    mockFetch(MOCK_METADATA);
    const result = await getTimeZoneByCountry('IN');
    expect(result).toEqual({
      'Asia/Kolkata': { utc_offset: 'UTC +05:30' },
    });
  });

  it('returns all timezones for a multi-timezone country', async () => {
    mockFetch(MOCK_METADATA);
    const result = await getTimeZoneByCountry('US');
    expect(Object.keys(result).length).toBeGreaterThan(1);
    expect(result['America/New_York']).toEqual({ utc_offset: 'UTC -05:00' });
  });

  it('normalizes country code to uppercase', async () => {
    mockFetch(MOCK_METADATA);
    const result = await getTimeZoneByCountry('in');
    expect(result).toEqual({
      'Asia/Kolkata': { utc_offset: 'UTC +05:30' },
    });
  });

  it('rejects immediately for empty country code', async () => {
    await expect(getTimeZoneByCountry('')).rejects.toThrow(
      'getTimeZoneByCountry: country code must not be empty.',
    );
  });

  it('rejects immediately for whitespace-only country code', async () => {
    await expect(getTimeZoneByCountry('   ')).rejects.toThrow(
      'getTimeZoneByCountry: country code must not be empty.',
    );
  });

  it('throws for unknown country code', async () => {
    mockFetch(MOCK_METADATA);
    await expect(getTimeZoneByCountry('ZZ')).rejects.toThrow(
      'An error occurred while fetching timezone data for country "ZZ"',
    );
  });

  it('throws for country with no timezone data', async () => {
    mockFetch(MOCK_METADATA);
    await expect(getTimeZoneByCountry('NO_TZ')).rejects.toThrow(
      'An error occurred while fetching timezone data for country "NO_TZ"',
    );
  });

  it('throws when fetch response is not ok', async () => {
    mockFetch({}, false);
    await expect(getTimeZoneByCountry('IN')).rejects.toThrow(
      'An error occurred while fetching timezone data for country "IN"',
    );
  });

  it('throws when fetch rejects', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network failure')));
    await expect(getTimeZoneByCountry('IN')).rejects.toThrow(
      'An error occurred while fetching timezone data for country "IN"',
    );
  });
});
