import {
  ByParts,
  CurrencyCodeType,
  FormattedPartsObject,
  I18nifyNumberFormatOptions,
} from './types';
import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';
import { configureIntlFromI18nifyData } from './utils';

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

    let parts: ByParts['rawParts'] = formattedAmount;
    const formattedObj: FormattedPartsObject = {};
    const intlOptions = options?.intlOptions ? { ...options.intlOptions } : {};
    const currencyCode = (options?.currency || intlOptions.currency) as string;

    parts = configureIntlFromI18nifyData(parts, currencyCode);

    parts.forEach((p) => {
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

    return {
      ...formattedObj,
      isPrefixSymbol:
        parts.findIndex((item) => item.type === 'currency') <
        parts.findIndex((item) => item.type === 'integer'),
      rawParts: parts,
    };
  } catch (err) {
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
