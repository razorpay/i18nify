import { withErrorBoundary } from '../../common/errorBoundary';
import CURRENCY_INFO from '../../../../../i18nify-data/currency/data.json';

const getCurrencyList = () => {
  return CURRENCY_INFO.currency_information;
};

export default withErrorBoundary<typeof getCurrencyList>(getCurrencyList);
