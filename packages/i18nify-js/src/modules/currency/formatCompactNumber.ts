import { withErrorBoundary } from '../../common/errorBoundary';
import { CurrencyCodeType, I18nifyNumberFormatOptions } from './types';
import formatNumber from './formatNumber';

const CRORE = 10_000_000; // 1,00,00,000
const LAKH = 100_000; // 1,00,000

const trimTrailingZeros = (n: number): string =>
  n.toFixed(2).replace(/\.?0+$/, '');

const formatCompactNumber = (
  amount: string | number,
  options: {
    currency?: CurrencyCodeType;
    locale?: string;
    intlOptions?: I18nifyNumberFormatOptions;
  } = {},
): string => {
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error(
      `Parameter 'amount' is not a valid number. The received value was: ${amount} of type ${typeof amount}. Please ensure you pass a valid number.`,
    );

  const num = Number(amount);
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (abs >= CRORE) return `${sign}${trimTrailingZeros(abs / CRORE)} Cr`;
  if (abs >= LAKH) return `${sign}${trimTrailingZeros(abs / LAKH)} L`;

  return formatNumber(num, options);
};

export default withErrorBoundary<typeof formatCompactNumber>(
  formatCompactNumber,
);
