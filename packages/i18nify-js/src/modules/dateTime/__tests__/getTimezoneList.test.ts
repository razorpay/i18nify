import getTimezoneList from '../getTimezoneList';

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
      },
    },
    // Countries that share a timezone
    AG: {
      timezones: {
        'America/Port_of_Spain': { utc_offset: 'UTC -04:00' },
      },
    },
    LC: {
      timezones: {
        'America/Port_of_Spain': { utc_offset: 'UTC -04:00' },
      },
    },
    // Country with no timezones field
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

describe('getTimezoneList', () => {
  describe('returned structure', () => {
    it('returns a non-empty map of timezone identifiers', async () => {
      const result = await getTimezoneList();
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it('includes known IANA timezone keys', async () => {
      const result = await getTimezoneList();
      expect(result).toHaveProperty('Asia/Kolkata');
      expect(result).toHaveProperty('America/New_York');
    });

    it('each entry has utc_offset and countries array', async () => {
      const result = await getTimezoneList();
      for (const entry of Object.values(result)) {
        expect(typeof entry.utc_offset).toBe('string');
        expect(Array.isArray(entry.countries)).toBe(true);
      }
    });

    it('utc_offset value matches the source data', async () => {
      const result = await getTimezoneList();
      expect(result['Asia/Kolkata'].utc_offset).toBe('UTC +05:30');
      expect(result['America/New_York'].utc_offset).toBe('UTC -05:00');
    });

    it('countries list for a single-country timezone contains that country', async () => {
      const result = await getTimezoneList();
      expect(result['Asia/Kolkata'].countries).toContain('IN');
    });

    it('countries list for US timezones contains US', async () => {
      const result = await getTimezoneList();
      expect(result['America/New_York'].countries).toContain('US');
      expect(result['America/Chicago'].countries).toContain('US');
    });
  });

  describe('shared timezones', () => {
    it('aggregates multiple countries under a shared timezone', async () => {
      const result = await getTimezoneList();
      const entry = result['America/Port_of_Spain'];
      expect(entry.countries).toContain('AG');
      expect(entry.countries).toContain('LC');
    });

    it('does not duplicate a country code for the same timezone', async () => {
      const result = await getTimezoneList();
      const entry = result['America/Port_of_Spain'];
      const unique = new Set(entry.countries);
      expect(unique.size).toBe(entry.countries.length);
    });
  });

  describe('countries without timezones', () => {
    it('skips countries that have no timezones field', async () => {
      const result = await getTimezoneList();
      // XX has no timezones — it should not appear in any entry's countries list
      for (const entry of Object.values(result)) {
        expect(entry.countries).not.toContain('XX');
      }
    });
  });

  describe('empty metadata', () => {
    it('returns an empty object when no country has timezones', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              metadata_information: {
                XX: { country_name: 'Unknown' },
              },
            }),
        } as Response),
      );
      const result = await getTimezoneList();
      expect(result).toEqual({});
    });

    it('returns an empty object when metadata_information is missing', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ other_key: {} }),
        } as Response),
      );
      const result = await getTimezoneList();
      expect(result).toEqual({});
    });
  });

  describe('network and API errors', () => {
    it('rejects on network failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network timeout')),
      );
      await expect(getTimezoneList()).rejects.toThrow(
        'An error occurred while fetching the timezone list. The error details are: Network timeout.',
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
      await expect(getTimezoneList()).rejects.toThrow(
        'An error occurred while fetching the timezone list',
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
      await expect(getTimezoneList()).rejects.toThrow(
        'An error occurred while fetching the timezone list',
      );
    });
  });
});
