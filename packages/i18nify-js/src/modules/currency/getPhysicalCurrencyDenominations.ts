import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from '../../../../../i18nify-data/currency/data.json';
import { CurrencyCodeType } from './types';

/**
 * Gets the physical currency denominations for a given currency code.
 * @param currencyCode The currency code (e.g., "USD", "EUR") for which to retrieve denominations.
 * @returns An array of strings representing the physical currency denominations.
 */
const getPhysicalCurrencyDenominations = (
  currencyCode: CurrencyCodeType,
): string[] | undefined => {
  const currencyInformation = CURRENCY_INFO.currency_information;
  if (currencyCode in currencyInformation)
    return currencyInformation[currencyCode]?.physical_currency_denominations;
  else throw new Error(`Invalid currencyCode: ${String(currencyCode)}`);
};

export default withErrorBoundary<typeof getPhysicalCurrencyDenominations>(
  getPhysicalCurrencyDenominations,
);
