import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from '../.internal/jsonSubsets/currency/currencyDataSubset.json';

const getCurrencyList = () => {
  return CURRENCY_INFO;
};

export default withErrorBoundary<typeof getCurrencyList>(getCurrencyList);
