import { withErrorBoundary } from "../../common/errorBoundary";
import { CURRENCIES } from "./data/currencies";

/**
 * Converts an amount from a lower currency denomination to a higher currency denomination.
 * 
 * The function takes an amount in the lower denomination (e.g., cents, pence) and a currency code,
 * then converts the amount to the higher denomination (e.g., dollars, pounds) using the conversion rate
 * defined in the CURRENCIES object. If the currency code is not supported, it throws an error.
 *
 * @param {number} amount - The amount in the lower currency denomination.
 * @param {keyof typeof CURRENCIES} currencyCode - The currency code representing the specific currency.
 * @returns {number} - The amount converted to the higher currency denomination.
 * @throws Will throw an error if the currency code is not supported.
 */
const convertFromLowerDenominationToUpperDenomination = (amount: number, currencyCode: keyof typeof CURRENCIES): number => {
    const currencyInfo = CURRENCIES[currencyCode];
    
    if (!currencyInfo) {
        throw new Error(`Unsupported currency ${currencyCode}`);
    }

    const higherCurrencyValue = amount / currencyInfo.conversionRate;
    return higherCurrencyValue;
}

export default withErrorBoundary<typeof convertFromLowerDenominationToUpperDenomination>(convertFromLowerDenominationToUpperDenomination);