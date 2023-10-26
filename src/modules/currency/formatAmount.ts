const formatAmount = (
  currency_code: string,
  amount: string,
  options: {
    locale?: string;
    withSymbol?: boolean;
    currencyDisplay?: "code" | "symbol" | "narrowSymbol" | "name";
  } = {}
): string => {
  const { withSymbol = true, currencyDisplay = "symbol" } = options;
  let { locale } = options;

  // Set the locale for number formatting
  const numberFormatOptions: Intl.NumberFormatOptions = {
    style: withSymbol ? "currency" : "decimal",
    currency: currency_code,
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

  const formattedAmount = new Intl.NumberFormat(
    locale || undefined,
    mergedOptions
  ).format(parseFloat(amount));

  return formattedAmount;
};

export default formatAmount;
