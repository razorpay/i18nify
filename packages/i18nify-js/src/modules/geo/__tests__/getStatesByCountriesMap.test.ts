import { getStatesByCountriesMap } from '../index';

describe('getStatesByCountriesMap', () => {
  it('returns a map with 228 country entries', () => {
    const map = getStatesByCountriesMap();
    expect(Object.keys(map).length).toBe(228);
  });

  it('each entry has country_name and subdivisions', () => {
    const map = getStatesByCountriesMap();
    for (const cc of Object.keys(map)) {
      expect(typeof map[cc].country_name).toBe('string');
      expect(Array.isArray(map[cc].subdivisions)).toBe(true);
    }
  });

  it('each subdivision has code and name strings', () => {
    const map = getStatesByCountriesMap();
    for (const cc of Object.keys(map)) {
      for (const s of map[cc].subdivisions) {
        expect(typeof s.code).toBe('string');
        expect(typeof s.name).toBe('string');
      }
    }
  });

  it('contains US with 51 subdivisions and correct country_name', () => {
    const map = getStatesByCountriesMap();
    expect(map['US'].subdivisions).toHaveLength(51);
    expect(map['US'].country_name).toContain('United States');
  });

  it('contains all known large countries', () => {
    const map = getStatesByCountriesMap();
    for (const cc of ['US', 'IN', 'DE', 'JP', 'CN']) {
      expect(map[cc]).toBeDefined();
    }
  });

  it('returns consistent results across calls', () => {
    const a = getStatesByCountriesMap();
    const b = getStatesByCountriesMap();
    expect(a).toEqual(b);
  });
});
