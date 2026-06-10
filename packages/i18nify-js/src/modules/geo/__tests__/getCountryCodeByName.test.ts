import getCountryCodeByName from '../getCountryCodeByName';

describe('getCountryCodeByName', () => {
  describe('exact ISO 3166-1 official names', () => {
    it('"India" → "IN"', () =>
      expect(getCountryCodeByName('India')).toBe('IN'));
    it('"Germany" → "DE"', () =>
      expect(getCountryCodeByName('Germany')).toBe('DE'));
    it('"Japan" → "JP"', () =>
      expect(getCountryCodeByName('Japan')).toBe('JP'));
    it('"Brazil" → "BR"', () =>
      expect(getCountryCodeByName('Brazil')).toBe('BR'));
    it('"Saudi Arabia" → "SA"', () =>
      expect(getCountryCodeByName('Saudi Arabia')).toBe('SA'));
    it('"Czechia" → "CZ"', () =>
      expect(getCountryCodeByName('Czechia')).toBe('CZ'));
    it('"Türkiye" → "TR"', () =>
      expect(getCountryCodeByName('Türkiye')).toBe('TR'));
    it('"Viet Nam" → "VN"', () =>
      expect(getCountryCodeByName('Viet Nam')).toBe('VN'));
    it('"Macao" → "MO"', () =>
      expect(getCountryCodeByName('Macao')).toBe('MO'));
  });

  describe('ISO names with article annotations', () => {
    it('"Bahamas (the)" → "BS"', () =>
      expect(getCountryCodeByName('Bahamas (the)')).toBe('BS'));
    it('"United States of America (the)" → "US"', () =>
      expect(getCountryCodeByName('United States of America (the)')).toBe(
        'US',
      ));
    it('"United Kingdom of Great Britain and Northern Ireland (the)" → "GB"', () =>
      expect(
        getCountryCodeByName(
          'United Kingdom of Great Britain and Northern Ireland (the)',
        ),
      ).toBe('GB'));
    it('"Russian Federation (the)" → "RU"', () =>
      expect(getCountryCodeByName('Russian Federation (the)')).toBe('RU'));
    it('"Korea (the Republic of)" → "KR"', () =>
      expect(getCountryCodeByName('Korea (the Republic of)')).toBe('KR'));
    it('"Korea (the Democratic People\'s Republic of)" → "KP"', () =>
      expect(
        getCountryCodeByName("Korea (the Democratic People's Republic of)"),
      ).toBe('KP'));
    it('"Congo (the)" → "CG"', () =>
      expect(getCountryCodeByName('Congo (the)')).toBe('CG'));
    it('"Congo (the Democratic Republic of the)" → "CD"', () =>
      expect(
        getCountryCodeByName('Congo (the Democratic Republic of the)'),
      ).toBe('CD'));
  });

  describe('stripped annotation forms', () => {
    it('"Bahamas" → "BS"', () =>
      expect(getCountryCodeByName('Bahamas')).toBe('BS'));
    it('"United States of America" → "US"', () =>
      expect(getCountryCodeByName('United States of America')).toBe('US'));
    it('"Russian Federation" → "RU"', () =>
      expect(getCountryCodeByName('Russian Federation')).toBe('RU'));
    it('"Dominican Republic" → "DO"', () =>
      expect(getCountryCodeByName('Dominican Republic')).toBe('DO'));
    it('"Falkland Islands" → "FK"', () =>
      expect(getCountryCodeByName('Falkland Islands')).toBe('FK'));
    it('"France" → "FR"', () =>
      expect(getCountryCodeByName('France')).toBe('FR'));
    it('"Taiwan" → "TW"', () =>
      expect(getCountryCodeByName('Taiwan')).toBe('TW'));
    it('"Iran" → "IR"', () => expect(getCountryCodeByName('Iran')).toBe('IR'));
    it('"United Arab Emirates" → "AE"', () =>
      expect(getCountryCodeByName('United Arab Emirates')).toBe('AE'));
  });

  describe('common English aliases', () => {
    it('"United States" → "US"', () =>
      expect(getCountryCodeByName('United States')).toBe('US'));
    it('"USA" → "US"', () => expect(getCountryCodeByName('USA')).toBe('US'));
    it('"U.S.A." → "US"', () =>
      expect(getCountryCodeByName('U.S.A.')).toBe('US'));
    it('"United Kingdom" → "GB"', () =>
      expect(getCountryCodeByName('United Kingdom')).toBe('GB'));
    it('"UK" → "GB"', () => expect(getCountryCodeByName('UK')).toBe('GB'));
    it('"Russia" → "RU"', () =>
      expect(getCountryCodeByName('Russia')).toBe('RU'));
    it('"South Korea" → "KR"', () =>
      expect(getCountryCodeByName('South Korea')).toBe('KR'));
    it('"North Korea" → "KP"', () =>
      expect(getCountryCodeByName('North Korea')).toBe('KP'));
    it('"Vietnam" → "VN"', () =>
      expect(getCountryCodeByName('Vietnam')).toBe('VN'));
    it('"Laos" → "LA"', () => expect(getCountryCodeByName('Laos')).toBe('LA'));
    it('"Tanzania" → "TZ"', () =>
      expect(getCountryCodeByName('Tanzania')).toBe('TZ'));
    it('"Ivory Coast" → "CI"', () =>
      expect(getCountryCodeByName('Ivory Coast')).toBe('CI'));
    it('"DR Congo" → "CD"', () =>
      expect(getCountryCodeByName('DR Congo')).toBe('CD'));
    it('"DRC" → "CD"', () => expect(getCountryCodeByName('DRC')).toBe('CD'));
    it('"Republic of Congo" → "CG"', () =>
      expect(getCountryCodeByName('Republic of Congo')).toBe('CG'));
    it('"Turkey" → "TR"', () =>
      expect(getCountryCodeByName('Turkey')).toBe('TR'));
    it('"Czech Republic" → "CZ"', () =>
      expect(getCountryCodeByName('Czech Republic')).toBe('CZ'));
    it('"Vatican" → "VA"', () =>
      expect(getCountryCodeByName('Vatican')).toBe('VA'));
    it('"Macau" → "MO"', () =>
      expect(getCountryCodeByName('Macau')).toBe('MO'));
    it('"Burma" → "MM"', () =>
      expect(getCountryCodeByName('Burma')).toBe('MM'));
    it('"Palestine" → "PS"', () =>
      expect(getCountryCodeByName('Palestine')).toBe('PS'));
    it('"Netherlands" → "NL"', () =>
      expect(getCountryCodeByName('Netherlands')).toBe('NL'));
    it('"UAE" → "AE"', () => expect(getCountryCodeByName('UAE')).toBe('AE'));
  });

  describe('case insensitivity', () => {
    it('"india" → "IN"', () =>
      expect(getCountryCodeByName('india')).toBe('IN'));
    it('"INDIA" → "IN"', () =>
      expect(getCountryCodeByName('INDIA')).toBe('IN'));
    it('"germany" → "DE"', () =>
      expect(getCountryCodeByName('germany')).toBe('DE'));
    it('"united states" → "US"', () =>
      expect(getCountryCodeByName('united states')).toBe('US'));
    it('"usa" → "US"', () => expect(getCountryCodeByName('usa')).toBe('US'));
    it('"south korea" → "KR"', () =>
      expect(getCountryCodeByName('south korea')).toBe('KR'));
  });

  describe('whitespace handling', () => {
    it('leading/trailing spaces are trimmed', () =>
      expect(getCountryCodeByName('  India  ')).toBe('IN'));
    it('internal spaces are preserved', () =>
      expect(getCountryCodeByName('  United States  ')).toBe('US'));
  });

  describe('error handling', () => {
    it('throws for empty string', () =>
      expect(() => getCountryCodeByName('')).toThrow());
    it('throws for whitespace-only string', () =>
      expect(() => getCountryCodeByName('   ')).toThrow());
    it('throws for unknown country name', () =>
      expect(() => getCountryCodeByName('Neverland')).toThrow());
    it('error message includes the invalid name', () =>
      expect(() => getCountryCodeByName('Neverland')).toThrow('Neverland'));
    it('error message for empty input mentions the parameter', () =>
      expect(() => getCountryCodeByName('')).toThrow('countryName'));
  });
});
