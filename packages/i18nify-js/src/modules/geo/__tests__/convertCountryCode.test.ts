import convertCountryCode from '../convertCountryCode';

jest.mock('../../shared', () => ({
  I18NIFY_DATA_SOURCE: 'http://mocksource.com',
}));

const MOCK_METADATA = {
  metadata_information: {
    IN: { alpha_3: 'IND', country_name: 'India' },
    US: { alpha_3: 'USA', country_name: 'United States of America (the)' },
    GB: { alpha_3: 'GBR', country_name: 'United Kingdom' },
    DE: { alpha_3: 'DEU', country_name: 'Germany' },
    JP: { alpha_3: 'JPN', country_name: 'Japan' },
    SG: { alpha_3: 'SGP', country_name: 'Singapore' },
  },
};

(global.fetch as jest.Mock) = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve(MOCK_METADATA) }),
);

describe('convertCountryCode', () => {
  describe('alpha-2 → alpha-3', () => {
    it('IN → IND', () =>
      convertCountryCode('IN').then((r) => expect(r).toBe('IND')));
    it('US → USA', () =>
      convertCountryCode('US').then((r) => expect(r).toBe('USA')));
    it('GB → GBR', () =>
      convertCountryCode('GB').then((r) => expect(r).toBe('GBR')));
    it('DE → DEU', () =>
      convertCountryCode('DE').then((r) => expect(r).toBe('DEU')));
    it('JP → JPN', () =>
      convertCountryCode('JP').then((r) => expect(r).toBe('JPN')));
    it('SG → SGP', () =>
      convertCountryCode('SG').then((r) => expect(r).toBe('SGP')));
  });

  describe('alpha-3 → alpha-2', () => {
    it('IND → IN', () =>
      convertCountryCode('IND').then((r) => expect(r).toBe('IN')));
    it('USA → US', () =>
      convertCountryCode('USA').then((r) => expect(r).toBe('US')));
    it('GBR → GB', () =>
      convertCountryCode('GBR').then((r) => expect(r).toBe('GB')));
    it('DEU → DE', () =>
      convertCountryCode('DEU').then((r) => expect(r).toBe('DE')));
    it('JPN → JP', () =>
      convertCountryCode('JPN').then((r) => expect(r).toBe('JP')));
    it('SGP → SG', () =>
      convertCountryCode('SGP').then((r) => expect(r).toBe('SG')));
  });

  describe('case normalisation', () => {
    it('lowercase alpha-2 normalised', () =>
      convertCountryCode('in').then((r) => expect(r).toBe('IND')));
    it('lowercase alpha-3 normalised', () =>
      convertCountryCode('ind').then((r) => expect(r).toBe('IN')));
    it('mixed case normalised', () =>
      convertCountryCode('uSa').then((r) => expect(r).toBe('US')));
  });

  describe('error cases', () => {
    it('rejects empty string', () =>
      expect(convertCountryCode('')).rejects.toThrow());
    it('rejects single character', () =>
      expect(convertCountryCode('X')).rejects.toThrow());
    it('rejects four-char code', () =>
      expect(convertCountryCode('XXXX')).rejects.toThrow());
    it('rejects unknown alpha-2', () =>
      expect(convertCountryCode('XX')).rejects.toThrow('not found'));
    it('rejects unknown alpha-3', () =>
      expect(convertCountryCode('XYZ')).rejects.toThrow('not found'));
  });

  it('fetches from the correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(MOCK_METADATA),
    });
    await convertCountryCode('IN');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/country/metadata/data.json'),
    );
  });
});
