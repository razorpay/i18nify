import {
  ByParts,
  CurrencyCodeType,
  FormattedPartsObject,
  I18nifyNumberFormatOptions,
} from './types';
import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';

const formatNumberByParts = (
  amount: string | number,
  options: {
    currency?: CurrencyCodeType;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): ByParts => {
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error(
      `Parameter 'amount' is not a number. typeof amount: ${typeof amount}`,
    );

  try {
    const formattedAmount = getIntlInstanceWithOptions(options).formatToParts(
      Number(amount),
    );

    const parts = formattedAmount;

    const formattedObj: FormattedPartsObject = {};

    parts.forEach((p) => {
      if (p.type === 'group') {
        formattedObj.integer = (formattedObj.integer || '') + p.value;
      } else if (
        ALLOWED_FORMAT_PARTS_KEYS.findIndex((item) => item === p.type) != -1
      ) {
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
