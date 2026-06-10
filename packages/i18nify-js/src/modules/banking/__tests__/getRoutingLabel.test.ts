import getRoutingLabel from '../getRoutingLabel';

describe('getRoutingLabel', () => {
  describe('India — IFSC', () => {
    it('returns correct label and full_name', () => {
      const result = getRoutingLabel('IFSC');
      expect(result.label).toBe('IFSC');
      expect(result.full_name).toBe('Indian Financial System Code');
      expect(result.country).toBe('IN');
    });
  });

  describe('Global — SWIFT/BIC', () => {
    it('SWIFT returns SWIFT Code label', () => {
      const result = getRoutingLabel('SWIFT');
      expect(result.label).toBe('SWIFT Code');
      expect(result.full_name).toBe('SWIFT/BIC Code');
      expect(result.country).toBeUndefined();
    });
    it('BIC alias returns BIC label', () => {
      const result = getRoutingLabel('BIC');
      expect(result.label).toBe('BIC');
      expect(result.full_name).toBe('Bank Identifier Code');
    });
  });

  describe('US — ROUTING_NUMBER / ABA', () => {
    it('ROUTING_NUMBER returns ABA Routing Number', () => {
      const result = getRoutingLabel('ROUTING_NUMBER');
      expect(result.label).toBe('Routing Number');
      expect(result.country).toBe('US');
    });
    it('ABA alias resolves to same label', () => {
      const result = getRoutingLabel('ABA');
      expect(result.full_name).toBe('ABA Routing Number');
      expect(result.country).toBe('US');
    });
  });

  describe('UK — SORT_CODE', () => {
    it('returns Sort Code label with GB country', () => {
      const result = getRoutingLabel('SORT_CODE');
      expect(result.label).toBe('Sort Code');
      expect(result.full_name).toBe('UK Sort Code');
      expect(result.country).toBe('GB');
    });
  });

  describe('Australia — BSB', () => {
    it('returns BSB Number label with AU country', () => {
      const result = getRoutingLabel('BSB');
      expect(result.label).toBe('BSB Number');
      expect(result.country).toBe('AU');
    });
  });

  describe('Global — IBAN', () => {
    it('returns IBAN with no country (global)', () => {
      const result = getRoutingLabel('IBAN');
      expect(result.label).toBe('IBAN');
      expect(result.full_name).toBe('International Bank Account Number');
      expect(result.country).toBeUndefined();
    });
  });

  describe('Mexico — CLABE', () => {
    it('returns CLABE with MX country', () => {
      const result = getRoutingLabel('CLABE');
      expect(result.label).toBe('CLABE');
      expect(result.country).toBe('MX');
    });
  });

  describe('China — CNAPS', () => {
    it('returns CNAPS Code with CN country', () => {
      const result = getRoutingLabel('CNAPS');
      expect(result.label).toBe('CNAPS Code');
      expect(result.country).toBe('CN');
    });
  });

  describe('Canada — TRANSIT', () => {
    it('returns Transit Number with CA country', () => {
      const result = getRoutingLabel('TRANSIT');
      expect(result.label).toBe('Transit Number');
      expect(result.country).toBe('CA');
    });
  });

  describe('India — MICR', () => {
    it('returns MICR Code with IN country', () => {
      const result = getRoutingLabel('MICR');
      expect(result.label).toBe('MICR Code');
      expect(result.country).toBe('IN');
    });
  });

  describe('case-insensitive lookup', () => {
    it('lowercase "ifsc" resolves correctly', () => {
      expect(getRoutingLabel('ifsc').label).toBe('IFSC');
    });
    it('lowercase "sort_code" resolves correctly', () => {
      expect(getRoutingLabel('sort_code').label).toBe('Sort Code');
    });
  });

  describe('return shape', () => {
    it('always has label, full_name, description fields', () => {
      const result = getRoutingLabel('IBAN');
      expect(typeof result.label).toBe('string');
      expect(typeof result.full_name).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(result.description.length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('throws for unknown routing code type', () => {
      expect(() => getRoutingLabel('UNKNOWN_CODE')).toThrow('not supported');
    });
    it('throws for empty string', () => {
      expect(() => getRoutingLabel('')).toThrow('invalid');
    });
  });
});
