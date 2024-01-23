import { CURRENCIES } from './data/currencies';
import { withErrorBoundary } from '../../common/errorBoundary';

const getCurrencyList = () => {
  return CURRENCIES;
};

export default withErrorBoundary<typeof getCurrencyList>(getCurrencyList);
