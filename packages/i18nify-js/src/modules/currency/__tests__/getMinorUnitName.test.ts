import getMinorUnitName from '../getMinorUnitName';

describe('getMinorUnitName', () => {
  // Major currencies
  it('USD → cent', () => expect(getMinorUnitName('USD')).toBe('cent'));
  it('EUR → cent', () => expect(getMinorUnitName('EUR')).toBe('cent'));
  it('GBP → penny', () => expect(getMinorUnitName('GBP')).toBe('penny'));
  it('JPY → sen', () => expect(getMinorUnitName('JPY')).toBe('sen'));
  it('AUD → cent', () => expect(getMinorUnitName('AUD')).toBe('cent'));

  // South Asia
  it('INR → paisa', () => expect(getMinorUnitName('INR')).toBe('paisa'));
  it('PKR → paisa', () => expect(getMinorUnitName('PKR')).toBe('paisa'));
  it('NPR → paisa', () => expect(getMinorUnitName('NPR')).toBe('paisa'));

  // Arabic / RTL group
  it('BHD → fils', () => expect(getMinorUnitName('BHD')).toBe('fils'));
  it('KWD → fils', () => expect(getMinorUnitName('KWD')).toBe('fils'));
  it('AED → fils', () => expect(getMinorUnitName('AED')).toBe('fils'));
  it('SAR → halala', () => expect(getMinorUnitName('SAR')).toBe('halala'));
  it('OMR → baisa', () => expect(getMinorUnitName('OMR')).toBe('baisa'));
  it('TND → millime', () => expect(getMinorUnitName('TND')).toBe('millime'));
  it('ILS → agora', () => expect(getMinorUnitName('ILS')).toBe('agora'));

  // Europe
  it('NOK → øre', () => expect(getMinorUnitName('NOK')).toBe('øre'));
  it('SEK → öre', () => expect(getMinorUnitName('SEK')).toBe('öre'));
  it('RUB → kopek', () => expect(getMinorUnitName('RUB')).toBe('kopek'));

  // Africa
  it('NGN → kobo', () => expect(getMinorUnitName('NGN')).toBe('kobo'));
  it('GHS → pesewa', () => expect(getMinorUnitName('GHS')).toBe('pesewa'));

  // Returns null for valid but unlisted currency (ALL = Albanian Lek, not in static table)
  it('returns null for valid code not in table (ALL)', () =>
    expect(getMinorUnitName('ALL')).toBeNull());

  // Error case
  it('throws for invalid currency code', () => {
    // @ts-expect-error testing invalid input
    expect(() => getMinorUnitName('INVALID')).toThrow();
  });
});
