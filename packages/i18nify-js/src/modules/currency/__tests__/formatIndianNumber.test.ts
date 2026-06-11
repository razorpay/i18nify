import formatIndianNumber from '../formatIndianNumber';

describe('formatIndianNumber', () => {
  it('formats 1 lakh (1,00,000)', () => {
    expect(formatIndianNumber(100000)).toBe('1,00,000');
  });

  it('formats 10 lakhs (10,00,000)', () => {
    expect(formatIndianNumber(1000000)).toBe('10,00,000');
  });

  it('formats 1 crore (1,00,00,000)', () => {
    expect(formatIndianNumber(10000000)).toBe('1,00,00,000');
  });

  it('formats number with decimals', () => {
    expect(formatIndianNumber(1234567.89)).toBe('12,34,567.89');
  });

  it('formats number below 1000 (no grouping needed)', () => {
    expect(formatIndianNumber(999)).toBe('999');
  });

  it('formats 1000 with grouping', () => {
    expect(formatIndianNumber(1000)).toBe('1,000');
  });

  it('formats 10000 with Indian grouping', () => {
    expect(formatIndianNumber(10000)).toBe('10,000');
  });

  it('formats 100000 with Indian grouping', () => {
    expect(formatIndianNumber(100000)).toBe('1,00,000');
  });

  it('formats zero', () => {
    expect(formatIndianNumber(0)).toBe('0');
  });

  it('formats negative number', () => {
    expect(formatIndianNumber(-1000000)).toBe('-10,00,000');
  });

  it('accepts string amount', () => {
    expect(formatIndianNumber('100000')).toBe('1,00,000');
  });

  it('throws for non-numeric string', () => {
    expect(() => formatIndianNumber('abc')).toThrow();
  });

  it('formats with INR currency', () => {
    const result = formatIndianNumber(100000, { currency: 'INR' });
    expect(result).toContain('1,00,000');
    expect(result).toContain('₹');
  });
});
