import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { TimezoneDetail } from './types';

/**
 * Retrieves timezone identifiers and their UTC offsets for a given country.
 *
 * This function makes a network request to the central i18nify-data source and
 * returns a promise resolving to a map of IANA timezone identifiers to their
 * UTC offset strings.
 *
 * Countries that observe multiple timezones (e.g., "US", "RU", "AU") return
 * the full set. The returned structure is identical to the Go
 * GetTimeZoneByCountry implementation.
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (case-insensitive), e.g. "IN", "US".
 * @returns {Promise<Record<string, TimezoneDetail>>} A promise resolving to a
 *   map from IANA timezone identifier to timezone detail.
 *
 * @example
 * // Single-timezone country
 * getTimeZoneByCountry('IN');
 * // → { "Asia/Kolkata": { utc_offset: "UTC +05:30" } }
 *
 * @example
 * // Multi-timezone country
 * getTimeZoneByCountry('US');
 * // → { "America/New_York": { utc_offset: "UTC -05:00" }, "America/Chicago": { ... }, ... }
 */
const getTimeZoneByCountry = (
  countryCode: string,
): Promise<Record<string, TimezoneDetail>> => {
  if (!countryCode || !countryCode.trim()) {
    return Promise.reject(
      new Error('getTimeZoneByCountry: country code must not be empty.'),
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

      const timezones: Record<string, TimezoneDetail> =
        countryMeta.timezones ?? {};

      if (Object.keys(timezones).length === 0) {
        throw new Error(
          `No timezone data found for country code "${normalizedCode}".`,
        );
      }

      return timezones;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching timezone data for country "${countryCode}". The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getTimeZoneByCountry>(
  getTimeZoneByCountry,
);
