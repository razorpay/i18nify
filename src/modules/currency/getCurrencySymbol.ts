import { CURRENCY_DATA } from "./data/currencies";

const getCurrencySymbol = (currencyCode: string): string => {
  if (currencyCode in CURRENCY_DATA) return CURRENCY_DATA[currencyCode]?.symbol;
  else throw new Error("Invalid currencyCode!");
};

export default getCurrencySymbol;
