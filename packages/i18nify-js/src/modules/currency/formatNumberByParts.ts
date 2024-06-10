import {
  ByParts,
  CurrencyCodeType,
  FormattedPartsObject,
  I18nifyNumberFormatOptions,
} from './types';
import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { ALLOWED_FORMAT_PARTS_KEYS, INTL_MAPPING } from './constants';

const formatNumberByParts = (
  amount: string | number,
  options: {
    currency?: CurrencyCodeType;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): ByParts => {
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
    const parts = formattedAmount;
    const formattedObj: FormattedPartsObject = {};
    const intlOptions = options?.intlOptions ? { ...options.intlOptions } : {};
    const currencyCode = (options?.currency || intlOptions.currency) as string;

    // Loop through each part of the formatted amount
    parts.forEach((p) => {
      /** If the part is of type 'currency' and the provided currency code exists in INTL_MAPPING,
       *  replace the value of this part with the corresponding value from INTL_MAPPING.
       *  This replacement is done to allow customization of the currency symbol or other parameters,
       *  which may differ from the defaults provided by the Intl API.
       *
       *  Example: If the original currency symbol provided by Intl API is '$', but for the
       *  currency code 'SGD', we want to use 'S$', then we use INTL_MAPPING to make this replacement.
       */
      if (p.type === 'currency' && currencyCode in INTL_MAPPING) {
        const mapping = INTL_MAPPING[currencyCode as keyof typeof INTL_MAPPING];
        if (p.value in mapping) {
          p.value = mapping[p.value as keyof typeof mapping];
        }
      }

      // If the part is a group separator, add it to the integer part
      if (p.type === 'group') {
        formattedObj.integer = (formattedObj.integer || '') + p.value;
      } else if (
        ALLOWED_FORMAT_PARTS_KEYS.findIndex((item) => item === p.type) != -1
      ) {
        // If the part type is allowed, add it to the formatted object
        // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal' is skipped
        formattedObj[p.type] = (formattedObj[p.type] || '') + p.value;
      }
    });

    // Determine if the currency symbol is a prefix
    return {
      ...formattedObj,
      isPrefixSymbol:
        parts.findIndex((item) => item.type === 'currency') <
        parts.findIndex((item) => item.type === 'integer'),
      rawParts: parts,
    };
  } catch (err) {
    // Handle errors by throwing a new Error with the error message
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }
};

export default withErrorBoundary<typeof formatNumberByParts>(
  formatNumberByParts,
);
