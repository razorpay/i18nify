import { getStatesByCountry } from '../index';

describe('getStatesByCountry', () => {
  describe('data shape', () => {
    it('returns country_name and subdivisions array', () => {
      const result = getStatesByCountry('US');
      expect(typeof result.country_name).toBe('string');
      expect(Array.isArray(result.subdivisions)).toBe(true);
    });

    it('returns a correct country_name', () => {
      const result = getStatesByCountry('US');
      expect(result.country_name).toContain('United States');
    });

    it('returns 51 US subdivisions', () => {
      const result = getStatesByCountry('US');
      expect(result.subdivisions).toHaveLength(51);
    });

    it('each subdivision has code and name strings', () => {
      const result = getStatesByCountry('US');
      for (const s of result.subdivisions) {
        expect(typeof s.code).toBe('string');
        expect(typeof s.name).toBe('string');
        expect(s.code.length).toBeGreaterThan(0);
        expect(s.name.length).toBeGreaterThan(0);
      }
    });

    it('subdivision codes follow ISO 3166-2 format (CC-XX)', () => {
      const result = getStatesByCountry('US');
      for (const s of result.subdivisions) {
        expect(s.code).toMatch(/^[A-Z]{2}-/);
      }
    });

    it('returns correct subdivision for a known US state', () => {
      const result = getStatesByCountry('US');
      const ca = result.subdivisions.find((s) => s.code === 'US-CA');
      expect(ca).toBeDefined();
      expect(ca!.name).toBe('California');
    });

    it('returns correct data for India', () => {
      const result = getStatesByCountry('IN');
      expect(result.country_name).toContain('India');
      expect(result.subdivisions.length).toBeGreaterThan(20);
    });

    it('returns correct data for Germany', () => {
      const result = getStatesByCountry('DE');
      expect(result.subdivisions).toHaveLength(16);
      const bavaria = result.subdivisions.find((s) => s.code === 'DE-02');
      expect(bavaria?.name).toBe('Bavaria');
    });

    it('returns correct data for Great Britain', () => {
      const result = getStatesByCountry('GB');
      const england = result.subdivisions.find((s) => s.code === 'GB-ENG');
      expect(england?.name).toBe('England');
    });

    it('subdivisions are sorted by code', () => {
      const result = getStatesByCountry('US');
      const codes = result.subdivisions.map((s) => s.code);
      expect(codes).toEqual([...codes].sort());
    });
  });

  describe('input normalisation', () => {
    it('accepts lowercase country code', () => {
      expect(getStatesByCountry('us')).toEqual(getStatesByCountry('US'));
    });

    it('accepts mixed-case country code', () => {
      expect(getStatesByCountry('Us')).toEqual(getStatesByCountry('US'));
    });

    it('trims surrounding whitespace', () => {
      expect(getStatesByCountry('  US  ')).toEqual(getStatesByCountry('US'));
    });
  });

  describe('input validation', () => {
    it('throws on empty string', () => {
      expect(() => getStatesByCountry('')).toThrow();
    });

    it('throws on unknown country code', () => {
      expect(() => getStatesByCountry('ZZ')).toThrow(/No subdivision data/i);
    });
  });
});
