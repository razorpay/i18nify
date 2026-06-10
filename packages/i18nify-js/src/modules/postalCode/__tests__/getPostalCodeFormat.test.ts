import { getPostalCodeFormat } from '../index';

describe('getPostalCodeFormat', () => {
  describe('numeric postal codes', () => {
    it.each([
      ['US', 'numeric'],
      ['IN', 'numeric'],
      ['DE', 'numeric'],
      ['FR', 'numeric'],
      ['JP', 'numeric'],
    ])('%s → format is "%s"', (cc, expected) => {
      expect(getPostalCodeFormat(cc).format).toBe(expected);
    });
  });

  describe('alphanumeric postal codes', () => {
    it.each([
      ['CA', 'alphanumeric'],
      ['GB', 'alphanumeric'],
      ['NL', 'alphanumeric'],
      ['AR', 'alphanumeric'],
    ])('%s → format is "%s"', (cc, expected) => {
      expect(getPostalCodeFormat(cc).format).toBe(expected);
    });
  });

  describe('countries without postal codes', () => {
    it.each([
      ['AE', 'none'],
      ['HK', 'none'],
      ['BF', 'none'],
    ])('%s → format is "%s"', (cc, expected) => {
      expect(getPostalCodeFormat(cc).format).toBe(expected);
    });
  });

  describe('returned object shape', () => {
    it('includes country_name, format, zip_regex, and examples', () => {
      const result = getPostalCodeFormat('US');
      expect(result).toMatchObject({
        country_name: 'United States',
        format: 'numeric',
        zip_regex: expect.any(String),
        examples: expect.any(Array),
      });
    });

    it('CA result includes valid examples', () => {
      const { examples } = getPostalCodeFormat('CA');
      expect(examples.length).toBeGreaterThan(0);
    });
  });

  describe('case normalisation', () => {
    it('accepts lowercase country codes', () => {
      expect(getPostalCodeFormat('us').format).toBe('numeric');
    });

    it('accepts mixed-case country codes', () => {
      expect(getPostalCodeFormat('Gb').format).toBe('alphanumeric');
    });
  });

  describe('input validation', () => {
    it('throws on empty string', () => {
      expect(() => getPostalCodeFormat('')).toThrow();
    });

    it('throws on unknown country code', () => {
      expect(() => getPostalCodeFormat('XX')).toThrow(/XX/);
    });
  });
});
