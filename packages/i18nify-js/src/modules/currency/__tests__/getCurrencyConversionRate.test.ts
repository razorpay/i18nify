import { CURRENCIES } from '../data/currencies';
import getCurrencyConversionRate from '../getCurrencyConversionRate';

describe('currency - getCurrencyConversionRate', () => {
    it.each([
        ['USD', CURRENCIES.USD.conversionRate],
        ['GBP', CURRENCIES.GBP.conversionRate],
    ])('should return correct conversion rate for %s', (currencyCode, expectedRate) => {
        const rate = getCurrencyConversionRate(currencyCode as keyof typeof CURRENCIES);
        expect(rate).toBe(expectedRate);
    });

    // Test for unsupported currency
    it('should throw an error for unsupported currency codes', () => {
        const unsupportedCurrencyCode = 'XXX' as keyof typeof CURRENCIES; // Type assertion for the test case
        expect(() => {
            getCurrencyConversionRate(unsupportedCurrencyCode);
        }).toThrow(`Unsupported currency ${unsupportedCurrencyCode}`);
    });
});
