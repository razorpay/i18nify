import getTimeZoneByCountry from '../getTimeZoneByCountry';

const METADATA_RESPONSE = {
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
    AF: {
      timezones: {
        'Asia/Kabul': { utc_offset: 'UTC +04:30' },
      },
    },
    // No timezones field
    XX: {
      country_name: 'Unknown',
    },
  },
};

const mockFetch = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(METADATA_RESPONSE),
  } as Response);

beforeEach(() => {
  global.fetch = jest.fn(mockFetch);
});

describe('getTimeZoneByCountry', () => {
  describe('valid country codes', () => {
    it('returns a single timezone for a single-timezone country', async () => {
      const result = await getTimeZoneByCountry('IN');
      expect(result).toEqual({ 'Asia/Kolkata': { utc_offset: 'UTC +05:30' } });
    });

    it('returns all timezones for a multi-timezone country', async () => {
      const result = await getTimeZoneByCountry('US');
      expect(Object.keys(result)).toHaveLength(4);
      expect(result['America/New_York']).toEqual({ utc_offset: 'UTC -05:00' });
      expect(result['America/Los_Angeles']).toEqual({
        utc_offset: 'UTC -08:00',
      });
    });

    it('is case-insensitive — lowercased code works', async () => {
      const result = await getTimeZoneByCountry('in');
      expect(result).toEqual({ 'Asia/Kolkata': { utc_offset: 'UTC +05:30' } });
    });

    it('trims whitespace from country code', async () => {
      const result = await getTimeZoneByCountry('  IN  ');
      expect(result).toEqual({ 'Asia/Kolkata': { utc_offset: 'UTC +05:30' } });
    });

    it('each timezone entry contains utc_offset', async () => {
      const result = await getTimeZoneByCountry('US');
      for (const entry of Object.values(result)) {
        expect(entry).toHaveProperty('utc_offset');
        expect(typeof entry.utc_offset).toBe('string');
      }
    });
  });

  describe('empty / blank input', () => {
    it('rejects on empty string', async () => {
      await expect(getTimeZoneByCountry('')).rejects.toThrow(
        'getTimeZoneByCountry: country code must not be empty.',
      );
    });

    it('rejects on whitespace-only string', async () => {
      await expect(getTimeZoneByCountry('   ')).rejects.toThrow(
        'getTimeZoneByCountry: country code must not be empty.',
      );
    });
  });

  describe('unknown country codes', () => {
    it('rejects when country code is not in metadata', async () => {
      await expect(getTimeZoneByCountry('ZZ')).rejects.toThrow(
        'An error occurred while fetching timezone data for country "ZZ"',
      );
    });

    it('rejects when country has no timezones field', async () => {
      await expect(getTimeZoneByCountry('XX')).rejects.toThrow(
        'An error occurred while fetching timezone data for country "XX"',
      );
    });
  });

  describe('network and API errors', () => {
    it('rejects on network failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network timeout')),
      );
      await expect(getTimeZoneByCountry('IN')).rejects.toThrow(
        'An error occurred while fetching timezone data for country "IN". The error details are: Network timeout.',
      );
    });

    it('rejects on non-ok HTTP response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as Response),
      );
      await expect(getTimeZoneByCountry('IN')).rejects.toThrow(
        'An error occurred while fetching timezone data for country "IN"',
      );
    });

    it('rejects on HTTP 500 error', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response),
      );
      await expect(getTimeZoneByCountry('IN')).rejects.toThrow(
        'An error occurred while fetching timezone data for country "IN"',
      );
    });

    it('rejects when metadata_information key is missing', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ invalid_key: {} }),
        } as Response),
      );
      await expect(getTimeZoneByCountry('IN')).rejects.toThrow(
        'An error occurred while fetching timezone data for country "IN"',
      );
    });
  });
});
