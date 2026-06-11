import formatList from '../formatList';

describe('formatList', () => {
  // Basic joining
  it('returns empty string for empty array', () => {
    expect(formatList([])).toBe('');
  });

  it('returns single item as-is', () => {
    expect(formatList(['UPI'])).toBe('UPI');
  });

  it('joins two items with "and"', () => {
    expect(formatList(['UPI', 'Card'])).toBe('UPI and Card');
  });

  it('joins three items with Oxford comma — en', () => {
    expect(formatList(['UPI', 'Card', 'Wallet'])).toBe('UPI, Card, and Wallet');
  });

  it('joins four items — en', () => {
    expect(formatList(['A', 'B', 'C', 'D'])).toBe('A, B, C, and D');
  });

  // Locale
  it('uses locale-correct conjunction for French', () => {
    expect(formatList(['A', 'B', 'C'], { locale: 'fr' })).toBe('A, B et C');
  });

  it('uses locale-correct conjunction for German', () => {
    expect(formatList(['A', 'B', 'C'], { locale: 'de' })).toBe('A, B und C');
  });

  // type: disjunction
  it('uses "or" for disjunction type — en', () => {
    expect(formatList(['A', 'B'], { type: 'disjunction' })).toBe('A or B');
  });

  it('joins three items with disjunction — en', () => {
    expect(formatList(['A', 'B', 'C'], { type: 'disjunction' })).toBe(
      'A, B, or C',
    );
  });

  // style
  it('narrow style omits conjunction words — en', () => {
    expect(formatList(['A', 'B', 'C'], { style: 'narrow' })).toBe('A, B, C');
  });

  // Truncation
  it('truncates with default "N others" label', () => {
    const result = formatList(['UPI', 'Card', 'Wallet', 'NetBanking'], {
      maxItems: 2,
    });
    expect(result).toBe('UPI, Card, and 2 others');
  });

  it('truncation of 1 hidden item uses singular "other"', () => {
    const result = formatList(['A', 'B', 'C'], { maxItems: 2 });
    expect(result).toBe('A, B, and 1 other');
  });

  it('maxItems >= items.length shows all items without truncation', () => {
    expect(formatList(['A', 'B', 'C'], { maxItems: 5 })).toBe('A, B, and C');
  });

  it('maxItems = 1 truncates to first item plus others label', () => {
    const result = formatList(['A', 'B', 'C', 'D'], { maxItems: 1 });
    expect(result).toBe('A and 3 others');
  });

  it('custom othersLabel function is applied', () => {
    const result = formatList(['A', 'B', 'C', 'D'], {
      maxItems: 2,
      othersLabel: (n) => `${n} more`,
    });
    expect(result).toBe('A, B, and 2 more');
  });

  // Truncation with locale
  it('truncation respects locale conjunction', () => {
    const result = formatList(['A', 'B', 'C'], { locale: 'fr', maxItems: 1 });
    expect(result).toBe('A et 2 others');
  });

  // Error cases
  it('throws when items is not an array', () => {
    expect(() => formatList('not an array' as any)).toThrow();
  });

  it('throws for invalid locale', () => {
    expect(() =>
      formatList(['A', 'B'], { locale: 'zzz-ZZZ-invalid-long' }),
    ).toThrow();
  });
});
