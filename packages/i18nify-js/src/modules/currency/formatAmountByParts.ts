import { withErrorBoundary } from '../../common/errorBoundary';
import { ByParts, CurrencyCodeType, I18nifyNumberFormatOptions } from './types';
import formatNumberByParts from './formatNumberByParts';

const formatAmountByParts = (
  amount: string | number,
  currency: CurrencyCodeType,
  options: {
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): ByParts => {
  return formatNumberByParts(amount, { ...options, currency });
};

export default withErrorBoundary<typeof formatAmountByParts>(
  formatAmountByParts,
);
