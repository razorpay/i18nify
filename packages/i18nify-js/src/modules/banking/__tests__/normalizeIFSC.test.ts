import { normalizeIFSC } from '../index';

describe('banking - normalizeIFSC', () => {
  it('should trim and uppercase a valid IFSC', () => {
    expect(normalizeIFSC('  hdfc0001234  ')).toBe('HDFC0001234');
  });

  it('should preserve already-normalized IFSCs', () => {
    expect(normalizeIFSC('SBIN0000001')).toBe('SBIN0000001');
  });

  it('should throw for an empty string', () => {
    expect(() => normalizeIFSC('')).toThrow(/IFSC/);
  });

  it('should throw for invalid IFSC format', () => {
    expect(() => normalizeIFSC('HDFC1001234')).toThrow(/Invalid IFSC/);
  });
});
