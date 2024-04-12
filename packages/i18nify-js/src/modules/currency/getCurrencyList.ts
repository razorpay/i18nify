import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from './data/currencyConfig.json';

const getCurrencyList = () => {
  return CURRENCY_INFO;
};

export default withErrorBoundary<typeof getCurrencyList>(getCurrencyList);
