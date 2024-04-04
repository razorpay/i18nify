import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Asynchronously retrieves the timezone of the capital city for a given country code.
 *
 * This function takes a country code as input and returns a promise that resolves to the timezone of the capital city of that country
 * from a dynamically imported dataset. If the country code does not exist in the dataset,
 * it throws an Error.
 *
 * @param countryCode The country code for which the timezone of the capital city is requested.
 * @returns A promise that resolves to the timezone of the capital city for the specified country code.
 * @throws Error if the country code is not found in the dynamically imported dataset.
 */
const getTimeZoneByCountry = async (countryCode: string): Promise<string> => {
    const { default: COUNTRY_DATA } = await import('#/i18nify-data/country/metadata/data.json');
    
    if (!(countryCode in COUNTRY_DATA.metadata_information)) {
        throw new Error(`Invalid countryCode: ${countryCode}`);
    }
   
    return COUNTRY_DATA.metadata_information[countryCode as keyof typeof COUNTRY_DATA.metadata_information].timezone_of_capital;
}

export default withErrorBoundary<typeof getTimeZoneByCountry>(getTimeZoneByCountry);
