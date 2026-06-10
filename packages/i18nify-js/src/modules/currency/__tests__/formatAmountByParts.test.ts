import formatAmountByParts from '../formatAmountByParts';

describe('formatAmountByParts', () => {
  it('returns parts for USD amount', () => {
    const result = formatAmountByParts(1234.56, 'USD');
    expect(result.currency).toBe('$');
    expect(result.integer).toContain('1');
    expect(result.fraction).toBe('56');
  });

  it('returns parts for INR amount', () => {
    const result = formatAmountByParts(100000, 'INR');
    expect(result.currency).toBe('₹');
    expect(result.integer).toContain('1');
  });

  it('returns parts for EUR amount', () => {
    const result = formatAmountByParts(500, 'EUR', { locale: 'de-DE' });
    expect(result.currency).toBe('€');
    expect(result.fraction).toBe('00');
  });

  it('sets isPrefixSymbol true for prefix currencies (USD)', () => {
    const result = formatAmountByParts(100, 'USD');
    expect(result.isPrefixSymbol).toBe(true);
  });

  it('returns rawParts array with entries', () => {
    const result = formatAmountByParts(100, 'USD');
    expect(Array.isArray(result.rawParts)).toBe(true);
    expect(result.rawParts.length).toBeGreaterThan(0);
  });

  it('formats negative amount correctly', () => {
    const result = formatAmountByParts(-1234.56, 'USD');
    expect(result.minusSign).toBe('-');
    expect(result.fraction).toBe('56');
  });

  it('formats zero', () => {
    const result = formatAmountByParts(0, 'USD');
    expect(result.integer).toBe('0');
    expect(result.fraction).toBe('00');
  });

  it('accepts string amount', () => {
    const result = formatAmountByParts('1234.56', 'USD');
    expect(result.fraction).toBe('56');
  });

  it('throws for non-numeric amount', () => {
    expect(() => formatAmountByParts('abc', 'USD')).toThrow();
  });

  it('applies locale option', () => {
    const result = formatAmountByParts(100000, 'INR', { locale: 'en-IN' });
    expect(result.currency).toBe('₹');
    expect(result.integer).toContain('1');
  });
});
