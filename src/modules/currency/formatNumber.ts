import { CURRENCIES } from './data/currencies';
import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlProps } from '../shared/utils/getIntlProps';

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
    formattedAmount = getIntlProps(options).format(Number(amount));
  } catch (err) {
    throw new Error(err.message);
  }

  return formattedAmount;
};

export default withErrorBoundary<typeof formatNumber>(formatNumber);
