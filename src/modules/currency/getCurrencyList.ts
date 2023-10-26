import { CURRENCY_DATA } from "./data/currencies";
import { GetCurrencyListOutput } from "./types";

const getCurrencyList = (): GetCurrencyListOutput => {
  return CURRENCY_DATA;
}

export default getCurrencyList;
