import  convertFromLowerDenominationToUpperDenomination  from '../convertFromLowerDenominationToUpperDenomination';
import { CURRENCIES } from '../data/currencies';

describe('currency - convertFromLowerDenominationToUpperDenomination', () => {
    const testCases: { amount: number; currencyCode: keyof typeof CURRENCIES; expectedResult: number; }[]  = [
        { amount: 100, currencyCode: 'USD', expectedResult: 1 },
        { amount: 100, currencyCode: 'GBP', expectedResult: 1 },
    ];

    testCases.forEach(({ amount, currencyCode, expectedResult }) => {
        it(`should correctly convert ${amount} of lower denomination ${currencyCode} to ${expectedResult}`, () => {
            const result = convertFromLowerDenominationToUpperDenomination(amount, currencyCode);
            expect(result).toBe(expectedResult);
        });
    });

    it('should throw an error for unsupported currency codes', () => {
        const unsupportedCurrencyCode = 'XXX' as any; // Casting to 'any' to simulate runtime scenario
        expect(() => {
            convertFromLowerDenominationToUpperDenomination(100, unsupportedCurrencyCode);
        }).toThrow('Unsupported currency XXX');
    });
});
