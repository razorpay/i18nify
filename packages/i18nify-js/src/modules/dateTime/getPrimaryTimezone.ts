import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';

/**
 * Returns the primary IANA timezone identifier for a given country code.
 *
 * For single-timezone countries it is the only timezone. For multi-timezone
 * countries (e.g. "US", "RU", "AU") it is the capital city's timezone, sourced
 * from the timezone_of_capital field in the i18nify country metadata.
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (case-insensitive), e.g. "IN".
 * @returns {Promise<string>} A promise resolving to the primary IANA timezone identifier.
 *
 * @example
 * getPrimaryTimezone('IN');  // → "Asia/Kolkata"
 * getPrimaryTimezone('US');  // → "America/New_York"
 * getPrimaryTimezone('RU');  // → "Europe/Moscow"
 */
const getPrimaryTimezone = (countryCode: string): Promise<string> => {
  if (!countryCode || !countryCode.trim()) {
    return Promise.reject(
      new Error('getPrimaryTimezone: country code must not be empty.'),
    );
  }

  const normalizedCode = countryCode.trim().toUpperCase();

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((res) => {
      const countryMeta = res.metadata_information?.[normalizedCode];

      if (!countryMeta) {
        throw new Error(
          `Country code "${normalizedCode}" not found in metadata.`,
        );
      }

      const tz: string = countryMeta.timezone_of_capital ?? '';

      if (!tz) {
        throw new Error(
          `No primary timezone found for country code "${normalizedCode}".`,
        );
      }

      return tz;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching primary timezone for country "${countryCode}". The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getPrimaryTimezone>(getPrimaryTimezone);
