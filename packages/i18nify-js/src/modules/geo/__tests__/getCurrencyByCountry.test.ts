import getCurrencyByCountry from '../getCurrencyByCountry';

jest.mock('../../shared', () => ({
  I18NIFY_DATA_SOURCE: 'http://mocksource.com',
}));

const MOCK_METADATA = {
  metadata_information: {
    IN: { default_locale: 'en_IN', default_currency: 'INR' },
    US: { default_locale: 'en_US', default_currency: 'USD' },
    DE: { default_locale: 'de', default_currency: 'EUR' },
    JP: { default_locale: 'ja', default_currency: 'JPY' },
    KW: { default_locale: 'ar', default_currency: 'KWD' },
  },
};

beforeEach(() => {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    json: () => Promise.resolve(MOCK_METADATA),
  });
});

describe('getCurrencyByCountry', () => {
  it('returns INR for India', async () => {
    expect(await getCurrencyByCountry('IN')).toBe('INR');
  });

  it('returns USD for United States', async () => {
    expect(await getCurrencyByCountry('US')).toBe('USD');
  });

  it('returns EUR for Germany', async () => {
    expect(await getCurrencyByCountry('DE')).toBe('EUR');
  });

  it('returns JPY for Japan', async () => {
    expect(await getCurrencyByCountry('JP')).toBe('JPY');
  });

  it('returns KWD for Kuwait', async () => {
    expect(await getCurrencyByCountry('KW')).toBe('KWD');
  });

  it('throws for invalid country code', async () => {
    await expect(getCurrencyByCountry('XX' as any)).rejects.toThrow(
      'An error occurred while fetching currency for country',
    );
  });

  it('throws when countryCode is empty string', async () => {
    await expect(getCurrencyByCountry('' as any)).rejects.toThrow(
      'countryCode is required',
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('throws on network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network failure'),
    );
    await expect(getCurrencyByCountry('IN')).rejects.toThrow(
      'An error occurred while fetching currency for country',
    );
  });

  it('fetches from the metadata endpoint', async () => {
    await getCurrencyByCountry('IN');
    expect(fetch).toHaveBeenCalledWith(
      'http://mocksource.com/country/metadata/data.json',
    );
  });
});
