import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from './data/currencyConfig.json';
import type { CurrencyCodeType } from './types';

/**
 * Type guard: returns true and narrows `code` to `CurrencyCodeType` when the
 * input is a recognised ISO 4217 alphabetic currency code.
 * Accepts `unknown` so it can be used directly in runtime validation without
 * requiring a prior cast.
 */
const isValidCurrencyCode = (code: unknown): code is CurrencyCodeType =>
  typeof code === 'string' && code.length > 0 && code in CURRENCY_INFO;

export default withErrorBoundary<typeof isValidCurrencyCode>(
  isValidCurrencyCode,
);
