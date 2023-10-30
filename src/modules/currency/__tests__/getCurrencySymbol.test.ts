import getCurrencySymbol from "../getCurrencySymbol";

describe("getCurrencySymbol", () => {
  it("should return the correct symbol for a valid currency code", () => {
    const currencyCode = "USD";
    const expectedSymbol = "$";
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBe(expectedSymbol);
  });

  it("should return undefined for an invalid currency code", () => {
    const currencyCode = "XYZ"; // An invalid code
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBeUndefined();
  });

  it("should return undefined for an empty string", () => {
    const currencyCode = "";
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBeUndefined();
  });

  it("should return undefined for a non-existent currency code", () => {
    const currencyCode = "ZZZ"; // A code that doesn't exist in the data
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBeUndefined();
  });

  it("should handle special characters in currency codes", () => {
    const currencyCode = "د.ك"; // A code with special characters
    const symbol = getCurrencySymbol(currencyCode);
    expect(symbol).toBeUndefined();
  });
});
