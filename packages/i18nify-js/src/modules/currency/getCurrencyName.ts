import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from '#/i18nify-data/currency/data.json';
import { CurrencyCodeType } from './types';

/**
 * Gets the name of the currency for a given currency code.
 * @param currencyCode The currency code (e.g., "USD", "EUR") for which to retrieve the name.
 * @returns The name of the currency as a string.
 */
const getCurrencyName = (
  currencyCode: CurrencyCodeType,
): string | undefined => {
  const currencyInformation = CURRENCY_INFO.currency_information;
  if (currencyCode in currencyInformation)
    return currencyInformation[currencyCode]?.name;
  else throw new Error(`Invalid currencyCode: ${String(currencyCode)}`);
};

export default withErrorBoundary<typeof getCurrencyName>(getCurrencyName);
