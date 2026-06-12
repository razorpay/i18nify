import timezoneToCountry from '../timezoneToCountry';

const mockResponse = {
  metadata_information: {
    IN: {
      timezones: {
        'Asia/Kolkata': { utc_offset: 'UTC +05:30' },
      },
    },
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
  },
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  } as unknown as Response);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('timezoneToCountry', () => {
  it('returns a single country for unique timezones', async () => {
    await expect(timezoneToCountry('Asia/Kolkata')).resolves.toEqual(['IN']);
  });

  it('returns all countries sharing a timezone', async () => {
    const result = await timezoneToCountry('America/Port_of_Spain');
    expect(result).toEqual(['AG', 'LC']);
  });

  it('rejects empty timezone input', async () => {
    await expect(timezoneToCountry('')).rejects.toThrow(
      'timezoneToCountry: timezone must not be empty.',
    );
  });

  it('rejects unknown timezones', async () => {
    await expect(timezoneToCountry('Pacific/Fake')).rejects.toThrow(
      'An error occurred while fetching country codes for timezone "Pacific/Fake"',
    );
  });
});
