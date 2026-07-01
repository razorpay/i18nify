import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

// Minimum transaction amounts in minor units per ISO 4217 currency code.
// Source: Stripe's published minimum charge amounts (https://stripe.com/docs/currencies).
// For currencies not listed here, a default is derived from the currency's minor unit:
//   minor_unit == 0  →  1   (e.g. non-decimal currencies like XOF)
//   minor_unit >= 1  →  50  (50 of the lowest denomination, ~$0.50 equivalent)
const MINIMUM_VALUE_MAP: Partial<Record<string, number>> = {
  AED: 200,
  ARS: 50,
  AUD: 50,
  BRL: 50,
  CAD: 50,
  CHF: 50,
  COP: 50,
  CZK: 1500,
  DKK: 250,
  EUR: 50,
  GBP: 30,
  HKD: 400,
  HUF: 17500,
  IDR: 50,
  ILS: 50,
  INR: 50,
  JPY: 50,
  KRW: 50,
  MXN: 1000,
  MYR: 200,
  NOK: 300,
  NZD: 50,
  PHP: 50,
  PLN: 200,
  RON: 200,
  RUB: 50,
  SEK: 300,
  SGD: 50,
  THB: 1000,
  USD: 50,
  ZAR: 50,
};

const getMinimumValue = (currencyCode: CurrencyCodeType): number => {
  if (!currencyCode)
    throw new Error(
      `Parameter 'currencyCode' is invalid! The received value was: ${currencyCode}.`,
    );

  const currencyInfo = (
    CURRENCY_INFO as Record<string, { minor_unit: string }>
  )[currencyCode as string];
  if (!currencyInfo)
    throw new Error(
      `Currency code "${currencyCode}" is not supported. Please provide a valid ISO 4217 currency code.`,
    );

  const explicit = MINIMUM_VALUE_MAP[currencyCode as string];
  if (explicit !== undefined) return explicit;

  const minorUnit = Number(currencyInfo.minor_unit);
  return minorUnit === 0 ? 1 : 50;
};

export default withErrorBoundary<typeof getMinimumValue>(getMinimumValue);
