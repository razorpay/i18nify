import getOrdinalSuffix from '../getOrdinalSuffix';

describe('getOrdinalSuffix', () => {
  describe('basic suffixes', () => {
    it('1 → "st"', () => expect(getOrdinalSuffix(1)).toBe('st'));
    it('2 → "nd"', () => expect(getOrdinalSuffix(2)).toBe('nd'));
    it('3 → "rd"', () => expect(getOrdinalSuffix(3)).toBe('rd'));
    it('4 → "th"', () => expect(getOrdinalSuffix(4)).toBe('th'));
    it('7 → "th"', () => expect(getOrdinalSuffix(7)).toBe('th'));
    it('10 → "th"', () => expect(getOrdinalSuffix(10)).toBe('th'));
  });

  describe('teen exceptions (11–13 → "th")', () => {
    it('11 → "th"', () => expect(getOrdinalSuffix(11)).toBe('th'));
    it('12 → "th"', () => expect(getOrdinalSuffix(12)).toBe('th'));
    it('13 → "th"', () => expect(getOrdinalSuffix(13)).toBe('th'));
  });

  describe('tens + 1/2/3 override', () => {
    it('21 → "st"', () => expect(getOrdinalSuffix(21)).toBe('st'));
    it('22 → "nd"', () => expect(getOrdinalSuffix(22)).toBe('nd'));
    it('23 → "rd"', () => expect(getOrdinalSuffix(23)).toBe('rd'));
    it('31 → "st"', () => expect(getOrdinalSuffix(31)).toBe('st'));
  });

  describe('hundreds — teen exception applies', () => {
    it('101 → "st"', () => expect(getOrdinalSuffix(101)).toBe('st'));
    it('111 → "th" (teen exception)', () =>
      expect(getOrdinalSuffix(111)).toBe('th'));
    it('112 → "th" (teen exception)', () =>
      expect(getOrdinalSuffix(112)).toBe('th'));
    it('113 → "th" (teen exception)', () =>
      expect(getOrdinalSuffix(113)).toBe('th'));
    it('121 → "st"', () => expect(getOrdinalSuffix(121)).toBe('st'));
  });

  describe('error handling', () => {
    it('throws for 0', () => expect(() => getOrdinalSuffix(0)).toThrow());
    it('throws for negative number', () =>
      expect(() => getOrdinalSuffix(-1)).toThrow());
    it('throws for non-integer (float)', () =>
      expect(() => getOrdinalSuffix(1.5)).toThrow());
    it('error message mentions the invalid value', () =>
      expect(() => getOrdinalSuffix(0)).toThrow('0'));
  });
});
