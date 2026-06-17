import alpha2ToAlpha3 from '../alpha2ToAlpha3';
import { CountryCodeType } from '../../types';

jest.mock('../../shared', () => ({
  I18NIFY_DATA_SOURCE: 'http://mocksource.com',
}));

const MOCK_METADATA = {
  metadata_information: {
    IN: { alpha_3: 'IND', country_name: 'India' },
    US: { alpha_3: 'USA', country_name: 'United States of America (the)' },
    DE: { alpha_3: 'DEU', country_name: 'Germany' },
    SG: { alpha_3: 'SGP', country_name: 'Singapore' },
  },
};

(global.fetch as jest.Mock) = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve(MOCK_METADATA) }),
);

describe('alpha2ToAlpha3', () => {
  it('converts IN to IND', async () => {
    const result = await alpha2ToAlpha3('IN' as CountryCodeType);
    expect(result).toBe('IND');
  });

  it('converts US to USA', async () => {
    const result = await alpha2ToAlpha3('US' as CountryCodeType);
    expect(result).toBe('USA');
  });

  it('converts DE to DEU', async () => {
    const result = await alpha2ToAlpha3('DE' as CountryCodeType);
    expect(result).toBe('DEU');
  });

  it('returns a plain string', async () => {
    const result = await alpha2ToAlpha3('SG' as CountryCodeType);
    expect(typeof result).toBe('string');
    expect(result).toBe('SGP');
  });

  it('rejects for an unknown country code', async () => {
    await expect(alpha2ToAlpha3('XX' as CountryCodeType)).rejects.toThrow(
      'Country code "XX" not found',
    );
  });

  it('rejects on network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network failure'),
    );
    await expect(alpha2ToAlpha3('IN' as CountryCodeType)).rejects.toThrow(
      'An error occurred while converting alpha-2 to alpha-3',
    );
  });

  it('fetches from the correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(MOCK_METADATA),
    });
    await alpha2ToAlpha3('IN' as CountryCodeType);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/country/metadata/data.json'),
    );
  });
});
