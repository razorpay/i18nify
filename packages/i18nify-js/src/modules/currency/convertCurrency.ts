import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType } from './types';
import CURRENCY_INFO from './data/currencyConfig.json';

const convertCurrency = (
  amount: number,
  options: {
    fromCurrency: CurrencyCodeType;
    toCurrency: CurrencyCodeType;
    exchangeRate: number;
  },
): number => {
  const { fromCurrency, toCurrency, exchangeRate } = options;

  if (!fromCurrency || !(fromCurrency in CURRENCY_INFO))
    throw new Error(
      `The provided source currency code is invalid. The received value was: ${String(fromCurrency)}. Please ensure you pass a valid ISO 4217 currency code.`,
    );

  if (!toCurrency || !(toCurrency in CURRENCY_INFO))
    throw new Error(
      `The provided target currency code is invalid. The received value was: ${String(toCurrency)}. Please ensure you pass a valid ISO 4217 currency code.`,
    );

  if (
    typeof exchangeRate !== 'number' ||
    !isFinite(exchangeRate) ||
    exchangeRate <= 0
  )
    throw new Error(
      `The exchange rate must be a positive finite number. The received value was: ${String(exchangeRate)}.`,
    );

  const toMinorUnit = Number(CURRENCY_INFO[toCurrency].minor_unit);
  const multiplier = Math.pow(10, toMinorUnit);

  return Math.round(amount * exchangeRate * multiplier) / multiplier;
};

export default withErrorBoundary<typeof convertCurrency>(convertCurrency);
