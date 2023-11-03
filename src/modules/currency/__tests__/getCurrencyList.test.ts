import getCurrencyList from "../getCurrencyList";
import { CURRENCIES } from "../data/currencies";
describe('getCurrencyList', () => {
  it('should return the correct currency list', () => {
    const currencyList = getCurrencyList();
    expect(currencyList).toEqual(CURRENCIES);
  });
});
