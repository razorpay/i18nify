import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

/**
 * Converts an ISO 3166-1 alpha-2 country code to its alpha-3 equivalent.
 *
 * @param countryCode - Two-letter ISO 3166-1 alpha-2 code (e.g. "IN", "US")
 * @returns {Promise<string>} Resolves to the three-letter alpha-3 code (e.g. "IND", "USA")
 */
const alpha2ToAlpha3 = (countryCode: CountryCodeType): Promise<string> => {
  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then(
      (res: {
        metadata_information: Record<CountryCodeType, CountryMetaType>;
      }) => {
        const info = res.metadata_information[countryCode];
        if (!info) {
          return Promise.reject(
            new Error(
              `Country code "${countryCode}" not found. Please provide a valid ISO 3166-1 alpha-2 code.`,
            ),
          );
        }
        if (!info.alpha_3) {
          return Promise.reject(
            new Error(
              `No alpha-3 code available for country "${countryCode}".`,
            ),
          );
        }
        return info.alpha_3;
      },
    )
    .catch((err) => {
      throw new Error(
        `An error occurred while converting alpha-2 to alpha-3. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof alpha2ToAlpha3>(alpha2ToAlpha3);
