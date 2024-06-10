import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { ByParts, CurrencyCodeType, I18nifyNumberFormatOptions } from './types';
import { INTL_MAPPING } from './constants';

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
    const parts: ByParts['rawParts'] = formattedAmount;
    const intlOptions = options?.intlOptions ? { ...options.intlOptions } : {};
    const currencyCode = (options?.currency || intlOptions.currency) as string;

    // Loop through each part of the formatted amount
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      /** If the part is of type 'currency' and the provided currency code exists in INTL_MAPPING,
       *  replace the value of this part with the corresponding value from INTL_MAPPING.
       *  This replacement is done to allow customization of the currency symbol or other parameters,
       *  which may differ from the defaults provided by the Intl API.
       *
       *  Example: If the original currency symbol provided by Intl API is '$', but for the
       *  currency code 'SGD', we want to use 'S$', then we use INTL_MAPPING to make this replacement.
       */
      if (part.type === 'currency' && currencyCode in INTL_MAPPING) {
        const mapping = INTL_MAPPING[currencyCode as keyof typeof INTL_MAPPING];
        if ((part.value as any) in mapping) {
          parts[i].value = mapping[part.value as keyof typeof mapping];
          break; // Exit the loop after the first replacement
        }
      }
    }

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
