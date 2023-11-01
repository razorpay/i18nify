import { CURRENCIES } from "./data/currencies";
import { GetCurrencyListOutput } from "./types";

const getCurrencyList = (): GetCurrencyListOutput => {
  return CURRENCIES;
};

export default getCurrencyList;
