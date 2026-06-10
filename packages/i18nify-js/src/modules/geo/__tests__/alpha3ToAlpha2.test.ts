import alpha3ToAlpha2 from '../alpha3ToAlpha2';

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

describe('alpha3ToAlpha2', () => {
  it('converts IND to IN', async () => {
    const result = await alpha3ToAlpha2('IND');
    expect(result).toBe('IN');
  });

  it('converts USA to US', async () => {
    const result = await alpha3ToAlpha2('USA');
    expect(result).toBe('US');
  });

  it('converts DEU to DE', async () => {
    const result = await alpha3ToAlpha2('DEU');
    expect(result).toBe('DE');
  });

  it('returns a plain string', async () => {
    const result = await alpha3ToAlpha2('SGP');
    expect(typeof result).toBe('string');
    expect(result).toBe('SG');
  });

  it('is case-insensitive for the input', async () => {
    const result = await alpha3ToAlpha2('ind');
    expect(result).toBe('IN');
  });

  it('trims whitespace from input', async () => {
    const result = await alpha3ToAlpha2('  IND  ');
    expect(result).toBe('IN');
  });

  it('rejects on empty input', async () => {
    await expect(alpha3ToAlpha2('')).rejects.toThrow(
      'Alpha-3 code is required',
    );
  });

  it('rejects for an unknown alpha-3 code', async () => {
    await expect(alpha3ToAlpha2('XYZ')).rejects.toThrow(
      'Alpha-3 code "XYZ" not found',
    );
  });

  it('rejects on network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network failure'),
    );
    await expect(alpha3ToAlpha2('IND')).rejects.toThrow(
      'An error occurred while converting alpha-3 to alpha-2',
    );
  });
});
