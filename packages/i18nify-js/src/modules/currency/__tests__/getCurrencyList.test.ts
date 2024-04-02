import { getCurrencyList } from '../index';
import CURRENCY_INFO from '#/i18nify-data/currency/data.json';

describe('getCurrencyList', () => {
  it('should return the correct currency list', () => {
    const currencyList = getCurrencyList();
    expect(currencyList).toEqual(CURRENCY_INFO.currency_information);
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
    expect(sampleCurrency.symbol).toBe(
      CURRENCY_INFO.currency_information[sampleCurrencyCode].symbol,
    );
    expect(sampleCurrency.name).toBe(
      CURRENCY_INFO.currency_information[sampleCurrencyCode].name,
    );
  });
});
