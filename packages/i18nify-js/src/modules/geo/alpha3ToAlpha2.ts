import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

/**
 * Converts an ISO 3166-1 alpha-3 country code to its alpha-2 equivalent.
 *
 * @param alpha3Code - Three-letter ISO 3166-1 alpha-3 code (e.g. "IND", "USA")
 * @returns {Promise<CountryCodeType>} Resolves to the two-letter alpha-2 code (e.g. "IN", "US")
 */
const alpha3ToAlpha2 = (alpha3Code: string): Promise<CountryCodeType> => {
  const normalised = alpha3Code.trim().toUpperCase();

  if (!normalised) {
    return Promise.reject(
      new Error(
        'Alpha-3 code is required. Please provide a valid ISO 3166-1 alpha-3 code.',
      ),
    );
  }

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then(
      (res: {
        metadata_information: Record<CountryCodeType, CountryMetaType>;
      }) => {
        const entry = Object.entries(res.metadata_information).find(
          ([, info]) => info.alpha_3?.toUpperCase() === normalised,
        );
        if (!entry) {
          return Promise.reject(
            new Error(
              `Alpha-3 code "${alpha3Code}" not found. Please provide a valid ISO 3166-1 alpha-3 code.`,
            ),
          );
        }
        return entry[0] as CountryCodeType;
      },
    )
    .catch((err) => {
      throw new Error(
        `An error occurred while converting alpha-3 to alpha-2. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof alpha3ToAlpha2>(alpha3ToAlpha2);
