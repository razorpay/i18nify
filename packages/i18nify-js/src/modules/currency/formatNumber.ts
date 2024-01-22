import { CURRENCIES } from './data/currencies';
import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';

// this function formats number based on different arguments passed
const formatNumber = (
  amount: string | number,
  options: {
    currency?: keyof typeof CURRENCIES;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
  } = {},
): string => {
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error('Parameter `amount` is not a number!');

  let formattedAmount = '';

  try {
    formattedAmount = getIntlInstanceWithOptions(options).format(
      Number(amount),
    );
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(`An unknown error occurred = ${err}`);
    }
  }

  return formattedAmount;
};

export default withErrorBoundary<typeof formatNumber>(formatNumber);
