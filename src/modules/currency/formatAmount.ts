import { CURRENCIES } from "./data/currencies";
import { withErrorBoundary } from "../../common/errorBoundary";

// this function formats amount based on locale and options provided
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
  };

  // Define a separate options object for currencyDisplay
  const currencyDisplayOptions: Record<string, string> = {
    currencyDisplay: currencyDisplay,
  };

  // Merge the two options objects
  const mergedOptions = {
    ...numberFormatOptions,
    ...currencyDisplayOptions,
  };

  // If a specific locale is provided, use it; otherwise, use the browser's locale
  if (!locale) {
    locale = window.navigator.language;
  }

  let formattedAmount = "";

  try {
    formattedAmount = new Intl.NumberFormat(
      locale || undefined,
      mergedOptions
    ).format(parseFloat(amount as string));
  } catch (err) {
    throw new Error(err.message);
  }

  return formattedAmount;
};

export default withErrorBoundary(formatAmount);
