import getPaymentNetwork from '../getPaymentNetwork';

describe('getPaymentNetwork', () => {
  describe('Americas', () => {
    it('USD → ACH as primary', () => {
      const result = getPaymentNetwork('USD');
      expect(result.primary).toBe('ACH');
      expect(result.networks).toContain('ACH');
      expect(result.networks).toContain('Fedwire');
    });
    it('BRL → Pix as primary', () => {
      const result = getPaymentNetwork('BRL');
      expect(result.primary).toBe('Pix');
    });
    it('MXN → SPEI', () => {
      const result = getPaymentNetwork('MXN');
      expect(result.primary).toBe('SPEI');
      expect(result.networks).toContain('SPEI');
    });
  });

  describe('Europe', () => {
    it('GBP → Faster Payments as primary', () => {
      const result = getPaymentNetwork('GBP');
      expect(result.primary).toBe('Faster Payments');
      expect(result.networks).toContain('CHAPS');
    });
    it('EUR → SEPA as primary', () => {
      const result = getPaymentNetwork('EUR');
      expect(result.primary).toBe('SEPA');
      expect(result.networks).toContain('TARGET2');
    });
    it('PLN → BLIK as primary', () => {
      const result = getPaymentNetwork('PLN');
      expect(result.primary).toBe('BLIK');
      expect(result.networks).toContain('ELIXIR');
    });
  });

  describe('South Asia', () => {
    it('INR → UPI as primary with all networks', () => {
      const result = getPaymentNetwork('INR');
      expect(result.primary).toBe('UPI');
      expect(result.networks).toContain('IMPS');
      expect(result.networks).toContain('NEFT');
      expect(result.networks).toContain('RTGS');
    });
  });

  describe('Asia Pacific', () => {
    it('SGD → FAST', () => {
      const result = getPaymentNetwork('SGD');
      expect(result.primary).toBe('FAST');
      expect(result.networks).toContain('MEPS+');
    });
    it('MYR → DuitNow', () => {
      const result = getPaymentNetwork('MYR');
      expect(result.primary).toBe('DuitNow');
    });
    it('JPY → Zengin', () => {
      expect(getPaymentNetwork('JPY').primary).toBe('Zengin');
    });
    it('HKD → FPS', () => {
      expect(getPaymentNetwork('HKD').primary).toBe('FPS');
    });
    it('CNY → CNAPS', () => {
      expect(getPaymentNetwork('CNY').primary).toBe('CNAPS');
    });
    it('THB → PromptPay', () => {
      expect(getPaymentNetwork('THB').primary).toBe('PromptPay');
    });
    it('PHP → InstaPay', () => {
      expect(getPaymentNetwork('PHP').primary).toBe('InstaPay');
    });
  });

  describe('Middle East', () => {
    it('AED → UAEFTS', () => {
      expect(getPaymentNetwork('AED').primary).toBe('UAEFTS');
    });
    it('SAR → SARIE', () => {
      expect(getPaymentNetwork('SAR').primary).toBe('SARIE');
    });
  });

  describe('Africa', () => {
    it('ZAR → RTC', () => {
      expect(getPaymentNetwork('ZAR').primary).toBe('RTC');
    });
    it('KES → PesaLink', () => {
      expect(getPaymentNetwork('KES').primary).toBe('PesaLink');
    });
    it('NGN → NIP', () => {
      expect(getPaymentNetwork('NGN').primary).toBe('NIP');
    });
  });

  describe('case-insensitive lookup', () => {
    it('lowercase "usd" resolves correctly', () => {
      expect(getPaymentNetwork('usd').primary).toBe('ACH');
    });
    it('lowercase "inr" resolves correctly', () => {
      expect(getPaymentNetwork('inr').primary).toBe('UPI');
    });
  });

  describe('return shape', () => {
    it('always returns networks array and primary string', () => {
      const result = getPaymentNetwork('USD');
      expect(Array.isArray(result.networks)).toBe(true);
      expect(result.networks.length).toBeGreaterThan(0);
      expect(typeof result.primary).toBe('string');
    });
    it('primary is always a member of networks', () => {
      const result = getPaymentNetwork('GBP');
      expect(result.networks).toContain(result.primary);
    });
  });

  describe('error handling', () => {
    it('throws for unknown currency code', () => {
      expect(() => getPaymentNetwork('XXX')).toThrow('not supported');
    });
    it('throws for empty string', () => {
      expect(() => getPaymentNetwork('')).toThrow('invalid');
    });
  });
});
