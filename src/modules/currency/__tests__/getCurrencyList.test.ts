import getCurrencyList from "../getCurrencyList";
import { CURRENCY_DATA } from "../data/currencies";
describe('getCurrencyList', () => {
  it('should return the correct currency list', () => {
    const currencyList = getCurrencyList();
    expect(currencyList).toEqual(CURRENCY_DATA);
  });
});
