import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../.internal/utils';
import { CurrencyCodeType, I18nifyNumberFormatOptions } from './types';

// this function formats number based on different arguments passed
const formatNumber = (
  amount: string | number,
  options: {
    currency?: CurrencyCodeType;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): string => {
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error(`Parameter 'amount' is not a number. Typeof amount is : ${typeof amount}`);

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
