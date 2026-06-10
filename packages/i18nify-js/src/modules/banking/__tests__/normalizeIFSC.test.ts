import normalizeIFSC from '../normalizeIFSC';

describe('normalizeIFSC', () => {
  it('already uppercase passes through', () =>
    expect(normalizeIFSC('SBIN0001234')).toBe('SBIN0001234'));
  it('lowercases input uppercased', () =>
    expect(normalizeIFSC('sbin0001234')).toBe('SBIN0001234'));
  it('trims leading/trailing whitespace', () =>
    expect(normalizeIFSC('  HDFC0001234  ')).toBe('HDFC0001234'));
  it('mixed case + whitespace', () =>
    expect(normalizeIFSC('  icic0A12345  ')).toBe('ICIC0A12345'));
  it('HDFC branch', () =>
    expect(normalizeIFSC('HDFC0001234')).toBe('HDFC0001234'));

  describe('error cases', () => {
    it('throws for empty string', () =>
      expect(() => normalizeIFSC('')).toThrow());
    it('throws for invalid format (5th char not 0)', () =>
      expect(() => normalizeIFSC('SBIN1001234')).toThrow(/Invalid IFSC/));
    it('throws for too short', () =>
      expect(() => normalizeIFSC('SBIN00123')).toThrow());
    // @ts-expect-error testing invalid type
    it('throws for null', () => expect(() => normalizeIFSC(null)).toThrow());
  });
});
