import { CurrencyCodeType, getCurrencyList } from '../index';
import CURRENCY_INFO from '../data/currencyConfig.json';
import { CurrencySubsetData } from '../types';

describe('getCurrencyList', () => {
  it('should return the correct currency list', () => {
    const currencyList = getCurrencyList();
    expect(currencyList).toEqual(CURRENCY_INFO);
  });

  it("check properties 'symbol' and 'name' for a sample currency", () => {
    const currencyList = getCurrencyList();
    const sampleCurrencyCode = 'USD' as CurrencyCodeType;

    expect(currencyList[sampleCurrencyCode]).toHaveProperty('symbol');
    expect(currencyList[sampleCurrencyCode]).toHaveProperty('name');
  });

  it("check the values of 'symbol' and 'name' properties for a sample currency", () => {
    const currencyList = getCurrencyList();
    const sampleCurrencyCode = 'USD' as CurrencyCodeType;
    const sampleCurrency: CurrencySubsetData[string] =
      currencyList[sampleCurrencyCode];

    // Assert that the 'symbol' and 'name' properties have the expected values
    expect(sampleCurrency.symbol).toBe(
      (CURRENCY_INFO as CurrencySubsetData)[sampleCurrencyCode].symbol,
    );
    expect(sampleCurrency.name).toBe(
      (CURRENCY_INFO as CurrencySubsetData)[sampleCurrencyCode].name,
    );
  });
});
