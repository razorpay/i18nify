import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { ByParts, CurrencyCodeType, I18nifyNumberFormatOptions } from './types';
import { configureIntlFromI18nifyData } from './utils';

// this function formats number based on different arguments passed
const formatNumber = (
  amount: string | number,
  options: {
    currency?: CurrencyCodeType;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): string => {
  // Validate the amount parameter to ensure it is a number
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error(
      `Parameter 'amount' is not a number. typeof amount: ${typeof amount}`,
    );

  try {
    // Get an instance of Intl.NumberFormat with the provided options
    const formattedAmount = getIntlInstanceWithOptions(options).formatToParts(
      Number(amount),
    );

    // Initialize an empty object to store the formatted parts
    let parts: ByParts['rawParts'] = formattedAmount;
    const intlOptions = options?.intlOptions ? { ...options.intlOptions } : {};
    const currencyCode = (options?.currency || intlOptions.currency) as string;

    parts = configureIntlFromI18nifyData(parts, currencyCode);

    // Join the parts back together to form the final formatted string
    return parts.map((p) => p.value).join('');
  } catch (err) {
    // Handle errors by throwing a new Error with the error message
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }
};

export default withErrorBoundary<typeof formatNumber>(formatNumber);
