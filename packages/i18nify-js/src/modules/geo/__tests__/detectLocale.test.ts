import detectLocale from '../detectLocale';

jest.mock('../../shared', () => ({
  I18NIFY_DATA_SOURCE: 'http://mocksource.com',
}));

const MOCK_METADATA = {
  metadata_information: {
    IN: { default_locale: 'en_IN', default_currency: 'INR' },
    IO: { default_locale: 'en_IO', default_currency: 'USD' },
    US: { default_locale: 'en_US', default_currency: 'USD' },
    DE: { default_locale: 'de', default_currency: 'EUR' },
    JP: { default_locale: 'ja', default_currency: 'JPY' },
  },
};

(global.fetch as jest.Mock) = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve(MOCK_METADATA) }),
);

describe('detectLocale', () => {
  // countryCode signal
  it('returns default_locale for a valid countryCode', async () => {
    expect(await detectLocale({ countryCode: 'IN' })).toBe('en_IN');
  });

  it('returns en_US for US countryCode', async () => {
    expect(await detectLocale({ countryCode: 'US' })).toBe('en_US');
  });

  // acceptLanguage signal (fast path — no fetch)
  it('parses single Accept-Language locale', async () => {
    expect(await detectLocale({ acceptLanguage: 'de-DE' })).toBe('de-DE');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('picks highest q-value locale from Accept-Language header', async () => {
    expect(
      await detectLocale({ acceptLanguage: 'en-US,en;q=0.9,fr;q=0.8' }),
    ).toBe('en-US');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('handles Accept-Language with no q-values', async () => {
    expect(await detectLocale({ acceptLanguage: 'ja,en' })).toBe('ja');
  });

  // browserLocale signal (fast path — no fetch)
  it('returns browserLocale directly', async () => {
    expect(await detectLocale({ browserLocale: 'fr-FR' })).toBe('fr-FR');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('trims whitespace from browserLocale', async () => {
    expect(await detectLocale({ browserLocale: '  en-GB  ' })).toBe('en-GB');
  });

  // currency signal (reverse lookup)
  it('reverse-looks up locale from currency code', async () => {
    expect(await detectLocale({ currency: 'INR' })).toBe('en_IN');
  });

  it('currency lookup is case-insensitive', async () => {
    expect(await detectLocale({ currency: 'usd' })).toBe('en_US');
  });

  it('prefers the canonical country locale for ambiguous currencies', async () => {
    expect(await detectLocale({ currency: 'USD' })).toBe('en_US');
  });

  // Priority order
  it('prefers countryCode over acceptLanguage', async () => {
    expect(
      await detectLocale({ countryCode: 'JP', acceptLanguage: 'en-US' }),
    ).toBe('ja');
  });

  it('falls back to acceptLanguage when countryCode not in metadata', async () => {
    expect(
      await detectLocale({ countryCode: 'XX' as any, acceptLanguage: 'en-US' }),
    ).toBe('en-US');
  });

  it('falls back to currency when countryCode and acceptLanguage both absent', async () => {
    expect(await detectLocale({ currency: 'JPY' })).toBe('ja');
  });

  // Error cases
  it('rejects when no signals are provided', async () => {
    await expect(detectLocale({})).rejects.toThrow(
      'At least one detection signal must be provided',
    );
  });

  it('rejects when currency is not found in any country', async () => {
    await expect(detectLocale({ currency: 'UNKNOWN' })).rejects.toThrow();
  });

  it('rejects on network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network failure'),
    );
    await expect(detectLocale({ countryCode: 'IN' })).rejects.toThrow(
      'An error occurred while detecting locale',
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(MOCK_METADATA),
    });
  });
});
