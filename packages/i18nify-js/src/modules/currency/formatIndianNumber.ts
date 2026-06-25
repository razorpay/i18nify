import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType, I18nifyNumberFormatOptions } from './types';
import formatNumber from './formatNumber';

const formatIndianNumber = (
  amount: string | number,
  options: {
    currency?: CurrencyCodeType;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): string => {
  return formatNumber(amount, { ...options, locale: 'en-IN' });
};

export default withErrorBoundary<typeof formatIndianNumber>(formatIndianNumber);
