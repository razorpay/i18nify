import getCountryTaxDefinition from '../getCountryTaxDefinition';

describe('getCountryTaxDefinition', () => {
  describe('GST countries', () => {
    it('IN → GST with standard_rate 18', () => {
      const def = getCountryTaxDefinition('IN');
      expect(def.tax_name).toBe('GST');
      expect(def.full_name).toBe('Goods and Services Tax');
      expect(def.standard_rate).toBe(18);
    });
    it('AU → GST 10%', () => {
      const def = getCountryTaxDefinition('AU');
      expect(def.tax_name).toBe('GST');
      expect(def.standard_rate).toBe(10);
    });
    it('SG → GST 9%', () => {
      const def = getCountryTaxDefinition('SG');
      expect(def.tax_name).toBe('GST');
      expect(def.standard_rate).toBe(9);
    });
    it('NZ → GST 15%', () => {
      expect(getCountryTaxDefinition('NZ').standard_rate).toBe(15);
    });
    it('CA → GST/HST 5% federal', () => {
      const def = getCountryTaxDefinition('CA');
      expect(def.tax_name).toBe('GST/HST');
      expect(def.standard_rate).toBe(5);
    });
  });

  describe('SST countries', () => {
    it('MY → SST 10%', () => {
      const def = getCountryTaxDefinition('MY');
      expect(def.tax_name).toBe('SST');
      expect(def.full_name).toBe('Sales and Service Tax');
      expect(def.standard_rate).toBe(10);
    });
  });

  describe('Sales Tax (no federal rate)', () => {
    it('US → Sales Tax, rate 0, has notes', () => {
      const def = getCountryTaxDefinition('US');
      expect(def.tax_name).toBe('Sales Tax');
      expect(def.standard_rate).toBe(0);
      expect(def.notes).toMatch(/state/i);
    });
  });

  describe('VAT countries', () => {
    it('GB → VAT 20%', () => {
      const def = getCountryTaxDefinition('GB');
      expect(def.tax_name).toBe('VAT');
      expect(def.standard_rate).toBe(20);
    });
    it('DE → MwSt 19%', () => {
      const def = getCountryTaxDefinition('DE');
      expect(def.tax_name).toBe('MwSt');
      expect(def.standard_rate).toBe(19);
    });
    it('AE → VAT 5%', () => {
      const def = getCountryTaxDefinition('AE');
      expect(def.tax_name).toBe('VAT');
      expect(def.standard_rate).toBe(5);
    });
    it('HU → ÁFA 27%', () => {
      const def = getCountryTaxDefinition('HU');
      expect(def.tax_name).toBe('ÁFA');
      expect(def.standard_rate).toBe(27);
    });
    it('JP → CT (Consumption Tax) 10%', () => {
      const def = getCountryTaxDefinition('JP');
      expect(def.tax_name).toBe('CT');
      expect(def.standard_rate).toBe(10);
    });
  });

  describe('no-tax countries', () => {
    it('HK → empty tax_name, rate 0', () => {
      const def = getCountryTaxDefinition('HK');
      expect(def.tax_name).toBe('');
      expect(def.standard_rate).toBe(0);
    });
    it('KW → empty tax_name, rate 0', () => {
      const def = getCountryTaxDefinition('KW');
      expect(def.tax_name).toBe('');
      expect(def.standard_rate).toBe(0);
    });
  });

  describe('case-insensitive lookup', () => {
    it('lowercase "in" resolves to India GST', () => {
      expect(getCountryTaxDefinition('in').tax_name).toBe('GST');
    });
    it('lowercase "gb" resolves to UK VAT', () => {
      expect(getCountryTaxDefinition('gb').tax_name).toBe('VAT');
    });
  });

  describe('return shape', () => {
    it('always has all four fields', () => {
      const def = getCountryTaxDefinition('FR');
      expect(typeof def.tax_name).toBe('string');
      expect(typeof def.full_name).toBe('string');
      expect(typeof def.standard_rate).toBe('number');
      expect(typeof def.notes).toBe('string');
    });
  });

  describe('error handling', () => {
    it('throws for unknown country code', () => {
      expect(() => getCountryTaxDefinition('XX')).toThrow('not supported');
    });
    it('throws for empty string', () => {
      expect(() => getCountryTaxDefinition('')).toThrow('invalid');
    });
  });
});
