import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

/**
 * Bidirectional ISO 3166-1 country code converter.
 * Detects input format by length and converts in the appropriate direction:
 * - 2-letter alpha-2 → 3-letter alpha-3 (e.g. "IN" → "IND")
 * - 3-letter alpha-3 → 2-letter alpha-2 (e.g. "IND" → "IN")
 *
 * @param countryCode - ISO 3166-1 alpha-2 or alpha-3 code
 * @returns {Promise<string>} The converted code in the opposite format
 */
const convertCountryCode = (countryCode: string): Promise<string> => {
  const normalised = countryCode.trim().toUpperCase();

  if (!normalised) {
    return Promise.reject(new Error('Country code is required.'));
  }

  if (normalised.length !== 2 && normalised.length !== 3) {
    return Promise.reject(
      new Error(
        `Invalid country code length: "${countryCode}". Expected 2 (alpha-2) or 3 (alpha-3) characters.`,
      ),
    );
  }

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then(
      (res: {
        metadata_information: Record<CountryCodeType, CountryMetaType>;
      }) => {
        const metadata = res.metadata_information;

        if (normalised.length === 2) {
          // alpha-2 → alpha-3
          const info = metadata[normalised as CountryCodeType];
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
        }

        // alpha-3 → alpha-2
        const entry = Object.entries(metadata).find(
          ([, info]) => info.alpha_3?.toUpperCase() === normalised,
        );
        if (!entry) {
          return Promise.reject(
            new Error(
              `Country code "${countryCode}" not found. Please provide a valid ISO 3166-1 alpha-3 code.`,
            ),
          );
        }
        return entry[0];
      },
    )
    .catch((err) => {
      throw new Error(
        `An error occurred while converting country code. The error details are: ${err?.message || err}.`,
      );
    });
};

export default withErrorBoundary<typeof convertCountryCode>(convertCountryCode);
