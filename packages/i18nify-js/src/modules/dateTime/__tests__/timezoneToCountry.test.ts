import timezoneToCountry from '../timezoneToCountry';

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
    // Countries sharing a timezone
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
    XX: { country_name: 'Unknown' },
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

afterEach(() => {
  jest.resetAllMocks();
});

describe('timezoneToCountry', () => {
  describe('single-country timezones', () => {
    it('returns ["IN"] for Asia/Kolkata', async () => {
      const result = await timezoneToCountry('Asia/Kolkata');
      expect(result).toEqual(['IN']);
    });

    it('returns an array with one element for a unique timezone', async () => {
      const result = await timezoneToCountry('Asia/Kolkata');
      expect(result).toHaveLength(1);
    });
  });

  describe('multi-country timezones', () => {
    it('returns all countries that share a timezone', async () => {
      const result = await timezoneToCountry('America/Port_of_Spain');
      expect(result).toContain('AG');
      expect(result).toContain('LC');
    });

    it('does not include unrelated countries', async () => {
      const result = await timezoneToCountry('America/Port_of_Spain');
      expect(result).not.toContain('IN');
      expect(result).not.toContain('US');
    });
  });

  describe('multi-timezone country', () => {
    it('includes US for America/New_York', async () => {
      const result = await timezoneToCountry('America/New_York');
      expect(result).toContain('US');
    });

    it('includes US for America/Chicago', async () => {
      const result = await timezoneToCountry('America/Chicago');
      expect(result).toContain('US');
    });
  });

  describe('whitespace handling', () => {
    it('trims leading/trailing whitespace from timezone', async () => {
      const result = await timezoneToCountry('  Asia/Kolkata  ');
      expect(result).toContain('IN');
    });
  });

  describe('empty / blank input', () => {
    it('rejects on empty string', async () => {
      await expect(timezoneToCountry('')).rejects.toThrow(
        'timezoneToCountry: timezone must not be empty.',
      );
    });

    it('rejects on whitespace-only string', async () => {
      await expect(timezoneToCountry('   ')).rejects.toThrow(
        'timezoneToCountry: timezone must not be empty.',
      );
    });
  });

  describe('unknown timezone', () => {
    it('rejects when timezone is not in any country', async () => {
      await expect(timezoneToCountry('Pacific/Fake')).rejects.toThrow(
        'An error occurred while fetching country codes for timezone "Pacific/Fake"',
      );
    });

    it('error message includes the timezone identifier', async () => {
      await expect(timezoneToCountry('NotReal/Zone')).rejects.toThrow(
        '"NotReal/Zone"',
      );
    });
  });

  describe('network and API errors', () => {
    it('rejects on network failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network timeout')),
      );
      await expect(timezoneToCountry('Asia/Kolkata')).rejects.toThrow(
        'An error occurred while fetching country codes for timezone "Asia/Kolkata". The error details are: Network timeout.',
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
      await expect(timezoneToCountry('Asia/Kolkata')).rejects.toThrow(
        'An error occurred while fetching country codes for timezone "Asia/Kolkata"',
      );
    });

    it('rejects on HTTP 500', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response),
      );
      await expect(timezoneToCountry('Asia/Kolkata')).rejects.toThrow(
        'An error occurred while fetching country codes for timezone "Asia/Kolkata"',
      );
    });
  });
});
