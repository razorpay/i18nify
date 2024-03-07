import {getCurrencyList} from '../index';
import { CURRENCIES } from '../data/currencies';
describe('getCurrencyList', () => {
  it('should return the correct currency list', () => {
    const currencyList = getCurrencyList();
    expect(currencyList).toEqual(CURRENCIES);
  });

  it("check properties 'symbol' and 'name' for a sample currency", () => {
    const currencyList = getCurrencyList();
    const sampleCurrencyCode = 'USD';

    expect(currencyList[sampleCurrencyCode]).toHaveProperty('symbol');
    expect(currencyList[sampleCurrencyCode]).toHaveProperty('name');
  });

  it("check the values of 'symbol' and 'name' properties for a sample currency", () => {
    const currencyList = getCurrencyList();
    const sampleCurrencyCode = 'USD';
    const sampleCurrency = currencyList[sampleCurrencyCode];

    // Assert that the 'symbol' and 'name' properties have the expected values
    expect(sampleCurrency.symbol).toBe(CURRENCIES[sampleCurrencyCode].symbol);
    expect(sampleCurrency.name).toBe(CURRENCIES[sampleCurrencyCode].name);
  });
});
