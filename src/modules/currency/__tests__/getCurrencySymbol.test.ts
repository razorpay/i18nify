import getCurrencySymbol from "../getCurrencySymbol";

describe("getCurrencySymbol", () => {
  it("should return the correct symbol for a valid currency code", () => {
    const currencyCode = "USD";
    const expectedSymbol = "$";
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBe(expectedSymbol);
  });

  it("should throw Error for an invalid currency code", () => {
    const currencyCode = "XYZ"; // An invalid code
    expect(() => getCurrencySymbol(currencyCode)).toThrow("Invalid currencyCode!");
  });

  it("should throw Error for an empty string", () => {
    const currencyCode = "";
    expect(() => getCurrencySymbol(currencyCode)).toThrow("Invalid currencyCode!");
  });

  it("should throw Error for a non-existent currency code", () => {
    const currencyCode = "ZZZ"; // A code that doesn't exist in the data
    expect(() => getCurrencySymbol(currencyCode)).toThrow("Invalid currencyCode!");
  });

  it("should handle special characters in currency codes", () => {
    const currencyCode = "د.ك"; // A code with special characters
    expect(() => getCurrencySymbol(currencyCode)).toThrow(
        "Invalid currencyCode!"
      );
  });
});
