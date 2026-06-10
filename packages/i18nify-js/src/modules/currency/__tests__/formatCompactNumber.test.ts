import formatCompactNumber from '../formatCompactNumber';

describe('formatCompactNumber', () => {
  // Crore
  it('formats 1 Crore', () => {
    expect(formatCompactNumber(10_000_000)).toBe('1 Cr');
  });

  it('formats 1.5 Crore', () => {
    expect(formatCompactNumber(15_000_000)).toBe('1.5 Cr');
  });

  it('formats 1.53 Crore (2dp)', () => {
    expect(formatCompactNumber(15_300_000)).toBe('1.53 Cr');
  });

  it('formats 100 Crore', () => {
    expect(formatCompactNumber(1_000_000_000)).toBe('100 Cr');
  });

  // Lakh
  it('formats 1 Lakh', () => {
    expect(formatCompactNumber(100_000)).toBe('1 L');
  });

  it('formats 5.5 Lakh', () => {
    expect(formatCompactNumber(550_000)).toBe('5.5 L');
  });

  it('formats 75 Lakh', () => {
    expect(formatCompactNumber(7_500_000)).toBe('75 L');
  });

  // Below 1L — falls through to formatNumber
  it('returns formatted number below 1 Lakh', () => {
    const result = formatCompactNumber(50_000);
    expect(typeof result).toBe('string');
    expect(result).not.toContain('Cr');
    expect(result).not.toContain('L');
  });

  it('formats zero', () => {
    expect(formatCompactNumber(0)).toBe('0');
  });

  // Negatives
  it('formats negative crore', () => {
    expect(formatCompactNumber(-10_000_000)).toBe('-1 Cr');
  });

  it('formats negative lakh', () => {
    expect(formatCompactNumber(-500_000)).toBe('-5 L');
  });

  // String input
  it('accepts string amount', () => {
    expect(formatCompactNumber('10000000')).toBe('1 Cr');
  });

  // Invalid input
  it('throws for non-numeric string', () => {
    expect(() => formatCompactNumber('abc')).toThrow();
  });
});
