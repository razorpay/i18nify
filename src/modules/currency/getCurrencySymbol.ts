import { CURRENCY_DATA } from "./data/currencies";

const  getCurrencySymbol = (currencyCode: string): string | undefined => {
  const currencyData = CURRENCY_DATA;
  return currencyData[currencyCode]?.symbol;
}

export default getCurrencySymbol;