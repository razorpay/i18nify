import { withErrorBoundary } from "../../common/errorBoundary";
import { CURRENCIES } from "./data/currencies";

/**
 * Retrieves the conversion rate from a lower currency denomination to a higher currency denomination
 * for the given currency code.
 *
 * The function looks up the currency code in the CURRENCIES object and returns the conversion rate.
 * If the currency code is not supported or not found in the CURRENCIES object, it throws an error.
 *
 * @param {keyof typeof CURRENCIES} currencyCode - The currency code representing the specific currency.
 * @returns {number} - The conversion rate from the lower denomination to the higher denomination for the specified currency.
 * @throws Will throw an error if the currency code is not supported or not found.
 */
const getCurrencyConversionRate = (currencyCode: keyof typeof CURRENCIES): number => {
    const currencyInfo = CURRENCIES[currencyCode];
    
    if (!currencyInfo) {
        throw new Error(`Unsupported currency ${currencyCode}`);
    }

    return currencyInfo.conversionRate;
}

export default withErrorBoundary<typeof getCurrencyConversionRate>(getCurrencyConversionRate);