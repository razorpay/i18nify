import getMinimumValue from '../getMinimumValue';

describe('getMinimumValue', () => {
  describe('explicit minimum values (Stripe reference dataset)', () => {
    it('USD returns 50', () => expect(getMinimumValue('USD')).toBe(50));
    it('INR returns 50', () => expect(getMinimumValue('INR')).toBe(50));
    it('EUR returns 50', () => expect(getMinimumValue('EUR')).toBe(50));
    it('GBP returns 30', () => expect(getMinimumValue('GBP')).toBe(30));
    it('JPY returns 50', () => expect(getMinimumValue('JPY')).toBe(50));
    it('AED returns 200', () => expect(getMinimumValue('AED')).toBe(200));
    it('HKD returns 400', () => expect(getMinimumValue('HKD')).toBe(400));
    it('HUF returns 17500', () => expect(getMinimumValue('HUF')).toBe(17500));
    it('CZK returns 1500', () => expect(getMinimumValue('CZK')).toBe(1500));
    it('MYR returns 200', () => expect(getMinimumValue('MYR')).toBe(200));
    it('DKK returns 250', () => expect(getMinimumValue('DKK')).toBe(250));
    it('NOK returns 300', () => expect(getMinimumValue('NOK')).toBe(300));
    it('SEK returns 300', () => expect(getMinimumValue('SEK')).toBe(300));
    it('MXN returns 1000', () => expect(getMinimumValue('MXN')).toBe(1000));
    it('THB returns 1000', () => expect(getMinimumValue('THB')).toBe(1000));
  });

  describe('fallback from minor_unit for unlisted currencies', () => {
    it('AFN (minor_unit=2, not in explicit list) returns 50', () => {
      expect(getMinimumValue('AFN')).toBe(50);
    });
    it('ALL (minor_unit=2, not in explicit list) returns 50', () => {
      expect(getMinimumValue('ALL')).toBe(50);
    });
    it('XOF (minor_unit=0, not in explicit list) returns 1', () => {
      expect(getMinimumValue('XOF')).toBe(1);
    });
    it('BIF (minor_unit=0, not in explicit list) returns 1', () => {
      expect(getMinimumValue('BIF')).toBe(1);
    });
  });

  describe('error handling', () => {
    it('throws for unknown currency code', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => getMinimumValue('XX' as any)).toThrow('not supported');
    });
    it('throws for empty currency code', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => getMinimumValue('' as any)).toThrow('invalid');
    });
  });
});
