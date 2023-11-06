import { CURRENCIES } from "./data/currencies";
import { ByParts } from "./types";

const formatAmountByParts = (
  currencyCode: keyof typeof CURRENCIES,
  amount: string | number,
  locale?: string
): ByParts => {
  if (!Number(amount)) throw new Error("Parameter `amount` is not a number!");

  // If a specific locale is provided, use it; otherwise, use the browser's locale
  if (!locale) {
    locale = window.navigator.language;
  }

  try {
    const formattedAmount = new Intl.NumberFormat(locale || undefined, {
      style: "currency",
      currency: currencyCode as string,
    }).formatToParts(Number(amount));

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

export default formatAmountByParts;
