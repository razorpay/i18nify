import { CURRENCIES } from "./data/currencies";
import { ByParts } from "./types";

const formatNumberByParts = (
  amount: string | number,
  options?: {
    currency?: keyof typeof CURRENCIES;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
  }
): ByParts => {
  if (!Number(amount)) throw new Error("Parameter `amount` is not a number!");

  let locale = options?.locale;

  // If a specific locale is provided, use it; otherwise, use the browser's locale
  if (!locale) {
    locale = window.navigator.language;
  }

  const intlOptions = options?.intlOptions ? { ...options.intlOptions } : {};

  if (options.currency || intlOptions.currency) {
    intlOptions.style = "currency";
    intlOptions.currency = (options.currency || intlOptions.currency) as string;
  }

  try {
    const formattedAmount = new Intl.NumberFormat(
      locale || undefined,
      intlOptions
    ).formatToParts(Number(amount));

    const parts = formattedAmount;
    let integerValue = "";
    let decimalValue = "";
    let currencySymbol = "";
    let separator = "";
    let symbolAtFirst = true;
    const partValues = parts.map((p: any) => {
      if (p.type === "integer" || p.type === "group") integerValue += p.value;
      else if (p.type === "fraction") decimalValue += p.value;
      else if (p.type === "currency") currencySymbol += p.value;
      else if (p.type === "decimal") separator += p.value;
      return p.value;
    });

    if (currencySymbol.toString() !== partValues[0].toString())
      symbolAtFirst = false;

    return {
      currencySymbol,
      decimalValue,
      integerValue,
      separator,
      symbolAtFirst,
    };
  } catch (error: unknown) {
    throw new Error(`Something went wrong`);
  }
};

export default formatNumberByParts;
