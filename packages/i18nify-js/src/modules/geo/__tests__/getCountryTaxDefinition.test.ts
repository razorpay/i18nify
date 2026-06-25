import getCountryTaxDefinition from '../getCountryTaxDefinition';

describe('getCountryTaxDefinition', () => {
  describe('GST countries', () => {
    it('returns GST definition for India (IN)', () => {
      const result = getCountryTaxDefinition('IN');
      expect(result).toEqual({
        tax_name: 'GST',
        full_name: 'Goods and Services Tax',
        standard_rate: 18,
        notes: 'Multiple slabs: 0%, 5%, 12%, 18%, 28%',
      });
    });

    it('returns GST definition for Australia (AU)', () => {
      const result = getCountryTaxDefinition('AU');
      expect(result.tax_name).toBe('GST');
      expect(result.standard_rate).toBe(10);
    });

    it('returns GST definition for Singapore (SG)', () => {
      const result = getCountryTaxDefinition('SG');
      expect(result.tax_name).toBe('GST');
      expect(result.standard_rate).toBe(9);
    });
  });

  describe('VAT countries', () => {
    it('returns VAT definition for Germany (DE)', () => {
      const result = getCountryTaxDefinition('DE');
      expect(result).toEqual({
        tax_name: 'MwSt',
        full_name: 'Mehrwertsteuer',
        standard_rate: 19,
        notes: '',
      });
    });

    it('returns VAT definition for United Kingdom (GB)', () => {
      const result = getCountryTaxDefinition('GB');
      expect(result.tax_name).toBe('VAT');
      expect(result.standard_rate).toBe(20);
    });

    it('returns VAT definition for UAE (AE)', () => {
      const result = getCountryTaxDefinition('AE');
      expect(result.tax_name).toBe('VAT');
      expect(result.standard_rate).toBe(5);
    });
  });

  describe('other tax systems', () => {
    it('returns Sales Tax definition for US', () => {
      const result = getCountryTaxDefinition('US');
      expect(result.tax_name).toBe('Sales Tax');
      expect(result.standard_rate).toBe(0);
      expect(result.notes).toContain('No federal rate');
    });

    it('returns SST definition for Malaysia (MY)', () => {
      const result = getCountryTaxDefinition('MY');
      expect(result.tax_name).toBe('SST');
      expect(result.standard_rate).toBe(10);
    });

    it('returns no-tax definition for Hong Kong (HK)', () => {
      const result = getCountryTaxDefinition('HK');
      expect(result.tax_name).toBe('');
      expect(result.standard_rate).toBe(0);
      expect(result.notes).toContain('No VAT or GST');
    });
  });

  describe('input normalisation', () => {
    it('accepts lowercase country code', () => {
      const result = getCountryTaxDefinition('in');
      expect(result.tax_name).toBe('GST');
    });

    it('accepts mixed-case country code', () => {
      const result = getCountryTaxDefinition('De');
      expect(result.tax_name).toBe('MwSt');
    });
  });

  describe('return shape', () => {
    it('always returns all four fields', () => {
      const result = getCountryTaxDefinition('FR');
      expect(result).toHaveProperty('tax_name');
      expect(result).toHaveProperty('full_name');
      expect(result).toHaveProperty('standard_rate');
      expect(result).toHaveProperty('notes');
    });

    it('standard_rate is a number', () => {
      const result = getCountryTaxDefinition('FI');
      expect(typeof result.standard_rate).toBe('number');
      expect(result.standard_rate).toBe(25.5);
    });
  });

  describe('error handling', () => {
    it('throws for empty string', () => {
      expect(() => getCountryTaxDefinition('')).toThrow(
        "Parameter 'countryCode' is invalid!",
      );
    });

    it('throws for unsupported country code', () => {
      expect(() => getCountryTaxDefinition('XX')).toThrow(
        'Country code "XX" is not supported',
      );
    });

    it('error message for unsupported code lists supported countries', () => {
      expect(() => getCountryTaxDefinition('ZZ')).toThrow(
        'Supported countries:',
      );
    });
  });
});
