export type CurrencyFormatterStyle =
  | 'WESTERN'
  | 'INDIAN'
  | 'EUROPEAN'
  | 'FRENCH'
  | 'SWISS'
  | 'SWAZI'
  | 'ARABIC'
  | 'BENGALI'
  | 'NO_GROUPING';

export interface CurrencyFormatterConfig {
  /** Thousands group separator (may be empty string for no grouping). */
  thousandsSep: string;
  /** Decimal point character. */
  decimalSep: string;
  /**
   * Grouping sizes applied right-to-left.
   * The last element repeats for all remaining groups.
   * [3]    → Western (all groups of 3)
   * [3, 2] → Indian  (rightmost group 3, then groups of 2)
   * []     → no grouping
   */
  groupSizes: number[];
  /**
   * Optional 10-character string where index 0-9 maps to locale-specific glyphs.
   * When absent, ASCII digits 0-9 are used.
   */
  digits?: string;
}

/**
 * Nine canonical locale-specific number-grouping styles for currency formatting.
 *
 * Style           Thousands  Decimal  Grouping  Example
 * WESTERN         ,          .        [3]       1,234,567.89
 * INDIAN          ,          .        [3,2]     12,34,567.89
 * EUROPEAN        .          ,        [3]       1.234.567,89
 * FRENCH                ,        [3]       1 234 567,89  (narrow no-break space)
 * SWISS           '          .        [3]       1'234'567.89
 * SWAZI           (space)    .        [3]       1 234 567.89
 * ARABIC          ٬ U+066C   ٫ U+066B [3]       ١٬٢٣٤٬٥٦٧٫٨٩
 * BENGALI         ,          .        [3,2]     ১২,৩৪,৫৬৭.৮৯
 * NO_GROUPING     (none)     .        []        1234567.89
 */
export const CURRENCY_FORMATTERS: Readonly<
  Record<CurrencyFormatterStyle, CurrencyFormatterConfig>
> = {
  WESTERN: { thousandsSep: ',', decimalSep: '.', groupSizes: [3] },
  INDIAN: { thousandsSep: ',', decimalSep: '.', groupSizes: [3, 2] },
  EUROPEAN: { thousandsSep: '.', decimalSep: ',', groupSizes: [3] },
  FRENCH: {
    thousandsSep: ' ', // narrow no-break space
    decimalSep: ',',
    groupSizes: [3],
  },
  SWISS: { thousandsSep: "'", decimalSep: '.', groupSizes: [3] },
  SWAZI: { thousandsSep: ' ', decimalSep: '.', groupSizes: [3] },
  ARABIC: {
    thousandsSep: '٬', // Arabic thousands separator ٬
    decimalSep: '٫', //  Arabic decimal separator   ٫
    groupSizes: [3],
    digits: '٠١٢٣٤٥٦٧٨٩',
  },
  BENGALI: {
    thousandsSep: ',',
    decimalSep: '.',
    groupSizes: [3, 2],
    digits: '০১২৩৪৫৬৭৮৯',
  },
  NO_GROUPING: { thousandsSep: '', decimalSep: '.', groupSizes: [] },
} as const;

/**
 * Groups the integer string `digits` using `groupSizes` and `sep`.
 * The last element of `groupSizes` repeats for all remaining groups.
 * Returns `digits` unchanged when `groupSizes` is empty or `sep` is empty string.
 */
export function groupIntegerPart(
  digits: string,
  groupSizes: number[],
  sep: string,
): string {
  if (!groupSizes.length || sep === '') return digits;

  const result: string[] = [];
  let pos = digits.length;
  let groupIdx = 0;

  while (pos > 0) {
    const size = groupSizes[Math.min(groupIdx, groupSizes.length - 1)];
    result.unshift(digits.slice(Math.max(0, pos - size), pos));
    pos -= size;
    groupIdx++;
  }

  return result.filter(Boolean).join(sep);
}

/**
 * Replaces ASCII digits 0-9 in `s` with the locale-specific glyphs in `digitGlyphs`.
 * `digitGlyphs` must be a string of exactly 10 characters where index i maps to digit i.
 */
export function substituteDigits(s: string, digitGlyphs: string): string {
  return s.replace(/[0-9]/g, (d) => digitGlyphs[parseInt(d, 10)]);
}
