import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';

/**
 * Reverse timezone lookup — given an IANA timezone identifier, returns the
 * ISO 3166-1 alpha-2 country codes that observe it.
 *
 * For single-country timezones (e.g. "Asia/Kolkata") the result is a
 * single-element array (["IN"]). For shared timezones (e.g. "America/New_York")
 * the result may contain multiple country codes.
 *
 * @param {string} timezone - IANA timezone identifier (e.g. "Asia/Kolkata").
 * @returns {Promise<string[]>} Country codes that observe the timezone.
 *
 * @example
 * timezoneToCountry('Asia/Kolkata');      // → ["IN"]
 * timezoneToCountry('America/New_York');  // → ["US", ...]
 */
const timezoneToCountry = (timezone: string): Promise<string[]> => {
  if (!timezone || !timezone.trim()) {
    return Promise.reject(
      new Error('timezoneToCountry: timezone must not be empty.'),
    );
  }

  const normalizedTz = timezone.trim();

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((res) => {
      const metadataInfo: Record<
        string,
        { timezones?: Record<string, unknown> }
      > = res.metadata_information ?? {};

      const countries: string[] = [];

      for (const countryCode of Object.keys(metadataInfo)) {
        const timezones = metadataInfo[countryCode]?.timezones ?? {};
        if (normalizedTz in timezones) {
          countries.push(countryCode);
        }
      }

      if (countries.length === 0) {
        throw new Error(
          `Timezone "${normalizedTz}" not found in any country metadata.`,
        );
      }

      return countries;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching country codes for timezone "${timezone}". The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof timezoneToCountry>(timezoneToCountry);
