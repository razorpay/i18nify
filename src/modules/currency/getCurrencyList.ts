import { CURRENCIES } from "./data/currencies";
import { GetCurrencyListOutput } from "./types";
import { withErrorBoundary } from "../../common/errorBoundary";

const getCurrencyList = (): GetCurrencyListOutput => {
  return CURRENCIES;
};

export default withErrorBoundary(getCurrencyList);
