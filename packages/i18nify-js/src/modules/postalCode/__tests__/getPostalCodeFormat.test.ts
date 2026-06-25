import getPostalCodeFormat from '../getPostalCodeFormat';

describe('getPostalCodeFormat', () => {
  it('returns postal code metadata for India', () => {
    expect(getPostalCodeFormat('IN')).toEqual({
      country_name: 'India',
      format: 'numeric',
      zip_regex: '\\d{6}',
      examples: ['110034', '110001'],
    });
  });

  it('supports lowercase input', () => {
    expect(getPostalCodeFormat('us')).toEqual({
      country_name: 'United States',
      format: 'numeric',
      zip_regex: '(\\d{5})(?:[ \\-](\\d{4}))?',
      examples: ['95014', '22162-1010'],
    });
  });

  it('trims surrounding whitespace', () => {
    expect(getPostalCodeFormat('  HK  ')).toEqual({
      country_name: 'Hong Kong',
      format: 'none',
      zip_regex: '',
      examples: [],
    });
  });

  it('throws for empty input', () => {
    expect(() => getPostalCodeFormat('')).toThrow(
      'countryCode must be a non-empty string.',
    );
  });

  it('throws for unsupported country codes', () => {
    expect(() => getPostalCodeFormat('XX')).toThrow(
      'No postal code data found for country code: "XX".',
    );
  });
});
