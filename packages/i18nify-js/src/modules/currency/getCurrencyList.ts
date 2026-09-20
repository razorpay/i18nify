import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from './data/currencyConfig.json';
import { CurrencyCodeType } from './types';

/**
 * Returns a copy of the currency table so callers cannot mutate the data
 * that the other currency utilities read from.
 */
const getCurrencyList = (): typeof CURRENCY_INFO => {
  const list = {} as typeof CURRENCY_INFO;
  for (const code of Object.keys(CURRENCY_INFO) as CurrencyCodeType[]) {
    list[code] = { ...CURRENCY_INFO[code] };
  }
  return list;
};

export default /*#__PURE__*/ withErrorBoundary<typeof getCurrencyList>(
  getCurrencyList,
);
