import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from './data/currencyConfig.json';

const AMOUNT_PATTERN = /^-?\d+(\.\d+)?$/;

const isValidAmount = (amount: string, currencyCode: string): boolean => {
  if (typeof amount !== 'string' || typeof currencyCode !== 'string')
    return false;

  const trimmed = amount.trim();
  if (!AMOUNT_PATTERN.test(trimmed)) return false;

  if (!(currencyCode in CURRENCY_INFO)) return false;

  const { minor_unit } =
    CURRENCY_INFO[currencyCode as keyof typeof CURRENCY_INFO];
  const allowedDecimals = parseInt(minor_unit, 10);

  const dotIndex = trimmed.indexOf('.');
  const actualDecimals = dotIndex === -1 ? 0 : trimmed.length - dotIndex - 1;

  return actualDecimals <= allowedDecimals;
};

export default withErrorBoundary<typeof isValidAmount>(isValidAmount);
