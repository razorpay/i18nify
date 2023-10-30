import formatAmount from "../formatAmount";

const mockNavigatorLanguage = (navigatorLanguage: string = "en-In"): void => {
  Object.defineProperty(window.navigator, "language", {
    value: navigatorLanguage,
    writable: true,
  });
};

describe("formatAmount", () => {
  it("should format the amount with default options", () => {
    const result = formatAmount("USD", "1000.5");
    expect(result).toBe("$1,000.50");
  });

  it("should format the amount with custom locale and currency display", () => {
    const result = formatAmount("EUR", "1500", {
      locale: "fr-FR",
      currencyDisplay: "code",
    });
    expect(result).toBe("1 500,00 EUR");
  });

  it("should format the amount without currency symbol", () => {
    const result = formatAmount("GBP", "750.75", { withSymbol: false });
    expect(result).toBe("750.75");
  });

  it("should format the amount with narrow currency symbol", () => {
    const result = formatAmount("JPY", "5000", {
      currencyDisplay: "narrowSymbol",
    });
    expect(result).toBe("¥5,000");
  });

  it("should format the amount using the browser locale when no custom locale is provided", () => {
    const result = formatAmount("CAD", "2000");
    const expectedLocale = window.navigator.language;
    const formattedAmount = new Intl.NumberFormat(expectedLocale, {
      style: "currency",
      currency: "CAD",
    }).format(2000);
    expect(result).toBe(formattedAmount);
  });

  it("should handle invalid inputs gracefully", () => {
    const result = formatAmount("USD", "invalid-amount");
    expect(result).toBe('');
  });
});
