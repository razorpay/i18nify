import {
  CURRENCY_FORMATTERS,
  groupIntegerPart,
  substituteDigits,
} from '../currencyFormatters';
import { formatWithStyle } from '../index';
import { CurrencyCodeType } from '../types';

// ── groupIntegerPart unit tests ──────────────────────────────────────────────

describe('groupIntegerPart', () => {
  it('applies Western [3] grouping', () => {
    expect(groupIntegerPart('1234567', [3], ',')).toBe('1,234,567');
  });

  it('applies Indian [3,2] grouping', () => {
    expect(groupIntegerPart('1234567', [3, 2], ',')).toBe('12,34,567');
    expect(groupIntegerPart('12345678', [3, 2], ',')).toBe('1,23,45,678');
  });

  it('returns the string unchanged when groupSizes is empty', () => {
    expect(groupIntegerPart('1234567', [], ',')).toBe('1234567');
  });

  it('returns the string unchanged when sep is empty', () => {
    expect(groupIntegerPart('1234567', [3], '')).toBe('1234567');
  });

  it('handles a single-group number', () => {
    expect(groupIntegerPart('567', [3], ',')).toBe('567');
  });

  it('handles a number shorter than the first group', () => {
    expect(groupIntegerPart('12', [3], ',')).toBe('12');
  });
});

// ── substituteDigits unit tests ──────────────────────────────────────────────

describe('substituteDigits', () => {
  const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';

  it('substitutes Arabic-Indic digits', () => {
    expect(substituteDigits('1234567', ARABIC_DIGITS)).toBe('١٢٣٤٥٦٧');
  });

  it('substitutes Bengali digits', () => {
    expect(substituteDigits('1234567', BENGALI_DIGITS)).toBe('১২৩৪৫৬৭');
  });

  it('leaves non-digit characters (commas, dots) unchanged', () => {
    // substituteDigits only maps 0-9 → locale glyphs; separators pass through as-is
    expect(substituteDigits('1,234.56', ARABIC_DIGITS)).toBe('١,٢٣٤.٥٦');
  });
});

// ── CURRENCY_FORMATTERS constant ─────────────────────────────────────────────

describe('CURRENCY_FORMATTERS', () => {
  it('exposes all 9 styles', () => {
    const expected = [
      'WESTERN',
      'INDIAN',
      'EUROPEAN',
      'FRENCH',
      'SWISS',
      'SWAZI',
      'ARABIC',
      'BENGALI',
      'NO_GROUPING',
    ];
    expect(Object.keys(CURRENCY_FORMATTERS)).toEqual(expected);
  });

  it('WESTERN uses comma thousands and period decimal', () => {
    expect(CURRENCY_FORMATTERS.WESTERN.thousandsSep).toBe(',');
    expect(CURRENCY_FORMATTERS.WESTERN.decimalSep).toBe('.');
    expect(CURRENCY_FORMATTERS.WESTERN.groupSizes).toEqual([3]);
  });

  it('INDIAN uses [3,2] grouping', () => {
    expect(CURRENCY_FORMATTERS.INDIAN.groupSizes).toEqual([3, 2]);
  });

  it('EUROPEAN uses period thousands and comma decimal', () => {
    expect(CURRENCY_FORMATTERS.EUROPEAN.thousandsSep).toBe('.');
    expect(CURRENCY_FORMATTERS.EUROPEAN.decimalSep).toBe(',');
  });

  it('FRENCH uses narrow no-break space thousands', () => {
    expect(CURRENCY_FORMATTERS.FRENCH.thousandsSep).toBe(' ');
    expect(CURRENCY_FORMATTERS.FRENCH.decimalSep).toBe(',');
  });

  it('SWISS uses apostrophe thousands', () => {
    expect(CURRENCY_FORMATTERS.SWISS.thousandsSep).toBe("'");
    expect(CURRENCY_FORMATTERS.SWISS.decimalSep).toBe('.');
  });

  it('ARABIC has digit glyph substitution', () => {
    expect(CURRENCY_FORMATTERS.ARABIC.digits).toBe('٠١٢٣٤٥٦٧٨٩');
    expect(CURRENCY_FORMATTERS.ARABIC.thousandsSep).toBe('٬');
    expect(CURRENCY_FORMATTERS.ARABIC.decimalSep).toBe('٫');
  });

  it('BENGALI uses Indian [3,2] grouping with Bengali digits', () => {
    expect(CURRENCY_FORMATTERS.BENGALI.groupSizes).toEqual([3, 2]);
    expect(CURRENCY_FORMATTERS.BENGALI.digits).toBe('০১২৩৪৫৬৭৮৯');
  });

  it('NO_GROUPING has empty thousandsSep and empty groupSizes', () => {
    expect(CURRENCY_FORMATTERS.NO_GROUPING.thousandsSep).toBe('');
    expect(CURRENCY_FORMATTERS.NO_GROUPING.groupSizes).toEqual([]);
  });
});

// ── formatWithStyle integration tests ────────────────────────────────────────

describe('currency - formatWithStyle', () => {
  const amount = 1234567.89;

  it('WESTERN: 1,234,567.89', () => {
    expect(formatWithStyle(amount, 'WESTERN')).toBe('1,234,567.89');
  });

  it('INDIAN: 12,34,567.89', () => {
    expect(formatWithStyle(amount, 'INDIAN')).toBe('12,34,567.89');
  });

  it('EUROPEAN: 1.234.567,89', () => {
    expect(formatWithStyle(amount, 'EUROPEAN')).toBe('1.234.567,89');
  });

  it('FRENCH: 1 234 567,89', () => {
    expect(formatWithStyle(amount, 'FRENCH')).toBe('1 234 567,89');
  });

  it("SWISS: 1'234'567.89", () => {
    expect(formatWithStyle(amount, 'SWISS')).toBe("1'234'567.89");
  });

  it('SWAZI: 1 234 567.89 (space separator)', () => {
    expect(formatWithStyle(amount, 'SWAZI')).toBe('1 234 567.89');
  });

  it('ARABIC: uses Arabic-Indic digits and separators', () => {
    const result = formatWithStyle(amount, 'ARABIC');
    expect(result).toBe('١٬٢٣٤٬٥٦٧٫٨٩');
  });

  it('BENGALI: uses Bengali digits with Indian grouping', () => {
    const result = formatWithStyle(amount, 'BENGALI');
    expect(result).toBe('১২,৩৪,৫৬৭.৮৯');
  });

  it('NO_GROUPING: 1234567.89', () => {
    expect(formatWithStyle(amount, 'NO_GROUPING')).toBe('1234567.89');
  });

  // Currency-aware decimal places
  it('respects currency minor_unit for INR (2 decimals)', () => {
    expect(
      formatWithStyle(1234.5, 'INDIAN', {
        currency: 'INR' as CurrencyCodeType,
      }),
    ).toBe('1,234.50');
  });

  it('respects currency minor_unit for JPY (0 decimals)', () => {
    expect(
      formatWithStyle(1234.9, 'WESTERN', {
        currency: 'JPY' as CurrencyCodeType,
      }),
    ).toBe('1,235');
  });

  it('respects currency minor_unit for BHD (3 decimals)', () => {
    expect(
      formatWithStyle(1.5, 'WESTERN', { currency: 'BHD' as CurrencyCodeType }),
    ).toBe('1.500');
  });

  // showSymbol option
  it('prepends INR symbol when showSymbol=true', () => {
    const result = formatWithStyle(1000, 'INDIAN', {
      currency: 'INR' as CurrencyCodeType,
      showSymbol: true,
    });
    expect(result).toBe('₹1,000.00');
  });

  // decimals override
  it('overrides decimal places via options.decimals', () => {
    expect(formatWithStyle(1234.567, 'WESTERN', { decimals: 3 })).toBe(
      '1,234.567',
    );
    expect(formatWithStyle(1234.567, 'WESTERN', { decimals: 0 })).toBe('1,235');
  });

  // Negative amounts
  it('preserves negative sign', () => {
    expect(formatWithStyle(-1234.56, 'WESTERN')).toBe('-1,234.56');
    expect(formatWithStyle(-1234.56, 'EUROPEAN')).toBe('-1.234,56');
  });

  // Error cases
  it('throws for NaN', () => {
    expect(() => formatWithStyle(NaN, 'WESTERN')).toThrow(
      "'amount' must be a finite number",
    );
  });

  it('throws for Infinity', () => {
    expect(() => formatWithStyle(Infinity, 'WESTERN')).toThrow(
      "'amount' must be a finite number",
    );
  });
});
