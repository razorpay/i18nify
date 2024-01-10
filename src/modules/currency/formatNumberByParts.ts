import { CURRENCIES } from './data/currencies';
import { ByParts, FormattedPartsObject } from './types';
import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';

const formatNumberByParts = (
  amount: string | number,
  options: {
    currency?: keyof typeof CURRENCIES;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
  } = {},
): ByParts => {
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error('Parameter `amount` is not a number!');

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
      isPrefixSymbol: parts[0].type === 'currency',
      parts,
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
