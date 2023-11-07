import { CURRENCIES } from "./data/currencies";
import { withErrorBoundary } from "../../common/errorBoundary";
import { getLocale } from "../shared/utils";

// this function formats amount based on locale, currencyCode and options provided
const formatAmount = (
  currencyCode: keyof typeof CURRENCIES,
  amount: string | number,
  options: {
    locale?: string;
    withSymbol?: boolean;
    currencyDisplay?: "code" | "symbol" | "narrowSymbol" | "name";
    currencySign?: "standard" | "accounting";
  } = {}
): string => {
  if (!Number(amount)) throw new Error("Parameter `amount` is not a number!");

  const {
    withSymbol = true,
    currencyDisplay = "symbol",
    currencySign = "standard",
  } = options;
  let { locale } = options;

  const numberFormatOptions: Intl.NumberFormatOptions = {
    style: withSymbol ? "currency" : "decimal",
    currency: currencyCode as string,
    currencySign: currencySign,
    currencyDisplay: currencyDisplay,
  };

  // If a specific locale is provided, use it; otherwise, use the browser's locale
  if (!locale) {
    locale = getLocale();
  }

  let formattedAmount = "";

  try {
    formattedAmount = new Intl.NumberFormat(
      locale || undefined,
      numberFormatOptions
    ).format(Number(amount));
  } catch (err) {
    throw new Error(err.message);
  }

  return formattedAmount;
};

export default withErrorBoundary(formatAmount);
