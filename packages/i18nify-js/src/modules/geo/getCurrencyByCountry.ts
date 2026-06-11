import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

/**
 * Retrieves the default currency code for a given country.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g. "IN", "US")
 * @returns Promise resolving to the ISO 4217 currency code (e.g. "INR", "USD")
 * @throws If the country code is invalid or the metadata cannot be fetched
 */
const getCurrencyByCountry = (
  countryCode: CountryCodeType,
): Promise<string> => {
  if (!countryCode?.trim()) {
    return Promise.reject(
      new Error(
        'countryCode is required. Please provide a valid ISO 3166-1 alpha-2 country code.',
      ),
    );
  }

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then(
      (res: {
        metadata_information: Record<CountryCodeType, CountryMetaType>;
      }) => {
        const info = res.metadata_information[countryCode];
        if (!info) {
          throw new Error(
            `The provided country code is invalid. The received value was: ${countryCode}.`,
          );
        }
        if (!info.default_currency) {
          throw new Error(
            `No default currency found for country code: ${countryCode}.`,
          );
        }
        return info.default_currency;
      },
    )
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching currency for country. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof getCurrencyByCountry>(
  getCurrencyByCountry,
);
