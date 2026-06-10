import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

/**
 * Converts a locale-formatted currency string to minor units.
 *
 * Accepts strings that may include currency symbols, thousands separators, and
 * either dot or comma as the decimal separator.
 *
 * Disambiguation rules:
 *   - Both comma AND period present → the one appearing last is the decimal separator.
 *   - Only one separator present → if the digit count after it exceeds the currency's
 *     minor unit, it is a thousands separator; otherwise it is the decimal separator.
 *     This correctly handles "¥1,234" (JPY, 0 minor units → thousands → 1234) and
 *     "1.234" (BHD, 3 minor units → decimal → 1234 fils).
 *
 * Examples:
 *   "$1,234.56"  + USD → 123456
 *   "1.234,56"   + EUR → 123456
 *   "10,50"      + EUR → 1050
 *   "¥1,234"     + JPY → 1234
 *   "₹4.14"      + INR → 414
 *   "1.234"      + BHD → 1234
 *
 * @param {string} amount - Locale-formatted currency string.
 * @param {object} options - Options object containing the currency code.
 * @returns {number} Amount in minor units (always an integer value).
 * @throws Will throw if the currency code is unsupported or the string is unparseable.
 */
const convertStringToMinorUnit = (
  amount: string,
  options: {
    currency: CurrencyCodeType;
  },
): number => {
  const currencyInfo = CURRENCY_INFO[options.currency];

  if (!options.currency || !currencyInfo) {
    throw new Error(
      `The provided currency code is either empty or not supported. The received value was ${(options.currency as any) === '' ? 'an empty string' : `: ${String(options.currency)}`}. Please ensure you pass a valid currency code. Check valid currency codes here: https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json`,
    );
  }

  // Strip currency symbols and whitespace; keep digits, comma, period, minus.
  const cleaned = amount.trim().replace(/[^0-9.,-]/g, '');

  if (!cleaned) {
    throw new Error(
      `Invalid amount string: "${amount}". Could not extract a numeric value.`,
    );
  }

  const minorUnitVal = Number(currencyInfo.minor_unit);
  const lastCommaIdx = cleaned.lastIndexOf(',');
  const lastPeriodIdx = cleaned.lastIndexOf('.');
  const hasBoth = lastCommaIdx !== -1 && lastPeriodIdx !== -1;

  let normalised: string;

  if (hasBoth) {
    // Both separators present: the one appearing last is the decimal separator.
    if (lastCommaIdx > lastPeriodIdx) {
      normalised = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      normalised = cleaned.replace(/,/g, '');
    }
  } else if (lastCommaIdx !== -1) {
    const digitsAfterComma = cleaned.length - lastCommaIdx - 1;
    if (digitsAfterComma > minorUnitVal) {
      // More digits than the currency allows → comma is a thousands separator.
      normalised = cleaned.replace(/,/g, '');
    } else {
      // Comma is the decimal separator (European format).
      normalised = cleaned.replace(',', '.');
    }
  } else if (lastPeriodIdx !== -1) {
    const digitsAfterPeriod = cleaned.length - lastPeriodIdx - 1;
    if (digitsAfterPeriod > minorUnitVal) {
      // More digits than the currency allows → period is a thousands separator.
      normalised = cleaned.replace(/\./g, '');
    } else {
      normalised = cleaned;
    }
  } else {
    normalised = cleaned;
  }

  const numericAmount = parseFloat(normalised);
  if (isNaN(numericAmount)) {
    throw new Error(
      `Invalid amount string: "${amount}". Could not parse as a number.`,
    );
  }

  const minorUnitMultiplier = Math.pow(10, minorUnitVal) || 1;
  return Math.round(numericAmount * minorUnitMultiplier);
};

export default withErrorBoundary<typeof convertStringToMinorUnit>(
  convertStringToMinorUnit,
);
