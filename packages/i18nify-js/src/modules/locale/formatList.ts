import { withErrorBoundary } from '../../common/errorBoundary';

type FormatListOptions = {
  locale?: string;
  type?: 'conjunction' | 'disjunction';
  style?: 'long' | 'short' | 'narrow';
  maxItems?: number;
  othersLabel?: (count: number) => string;
};

/**
 * Joins an array of strings into a locale-aware grammatical list.
 * Uses Intl.ListFormat (ECMA-402) for locale-correct conjunctions and separators.
 * Supports truncation: items beyond maxItems are collapsed into an "N others" label.
 *
 * @example
 * formatList(['UPI', 'Card', 'Wallet'])                           // "UPI, Card, and Wallet"
 * formatList(['UPI', 'Card', 'Wallet', 'NetBanking'], { maxItems: 2 })  // "UPI, Card, and 2 others"
 * formatList(['A', 'B', 'C'], { locale: 'fr' })                  // "A, B et C"
 * formatList(['A', 'B'], { type: 'disjunction' })                // "A or B"
 */
const formatList = (
  items: string[],
  options: FormatListOptions = {},
): string => {
  if (!Array.isArray(items))
    throw new Error(
      `Parameter 'items' must be an array of strings. Received: ${typeof items}.`,
    );

  if (items.length === 0) return '';

  const {
    locale = 'en',
    type = 'conjunction',
    style = 'long',
    maxItems,
    othersLabel,
  } = options;

  let displayItems = [...items];

  if (maxItems !== undefined && maxItems > 0 && items.length > maxItems) {
    const hidden = items.length - maxItems;
    const label = othersLabel
      ? othersLabel(hidden)
      : `${hidden} ${hidden === 1 ? 'other' : 'others'}`;
    displayItems = [...items.slice(0, maxItems), label];
  }

  try {
    // Intl.ListFormat is ECMA-402; cast required as TS target is ES2015
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (Intl as any).ListFormat(locale, { type, style }).format(
      displayItems,
    );
  } catch (err) {
    throw new Error(
      `An error occurred while formatting the list. The error details are: ${err instanceof Error ? err.message : err}.`,
    );
  }
};

export default withErrorBoundary<typeof formatList>(formatList);
