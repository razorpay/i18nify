import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { TimezoneListEntry } from './types';

/**
 * Retrieves the complete list of all IANA timezone identifiers across every
 * country, aggregated with their UTC offset and the list of country codes
 * that observe each timezone.
 *
 * This function makes a single network request to the central i18nify-data
 * source and builds an aggregated index from the country metadata. Countries
 * that share a timezone (e.g., multiple Caribbean nations sharing
 * "America/Port_of_Spain") are all listed under that timezone's entry.
 *
 * The returned structure mirrors the data model used by the Go
 * GetTimeZoneByCountry implementation extended with cross-country aggregation.
 *
 * @returns {Promise<Record<string, TimezoneListEntry>>} A promise resolving to
 *   a map from IANA timezone identifier to its detail and observing countries.
 *
 * @example
 * const list = await getTimezoneList();
 * list['Asia/Kolkata'];
 * // → { utc_offset: "UTC +05:30", countries: ["IN"] }
 *
 * list['America/New_York'];
 * // → { utc_offset: "UTC -05:00", countries: ["US", "CA", ...] }
 */
const getTimezoneList = (): Promise<Record<string, TimezoneListEntry>> => {
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
        { timezones?: Record<string, { utc_offset: string }> }
      > = res.metadata_information ?? {};

      const result: Record<string, TimezoneListEntry> = {};

      for (const countryCode of Object.keys(metadataInfo)) {
        const countryData = metadataInfo[countryCode];

        if (!countryData.timezones) continue;

        const timezones: Record<string, { utc_offset: string }> =
          countryData.timezones;
        Object.keys(timezones).forEach((tzIdentifier) => {
          const tzInfo = timezones[tzIdentifier];
          if (!result[tzIdentifier]) {
            result[tzIdentifier] = {
              utc_offset: tzInfo.utc_offset,
              countries: [],
            };
          }

          if (result[tzIdentifier].countries.indexOf(countryCode) === -1) {
            result[tzIdentifier].countries.push(countryCode);
          }
        });
      }

      return result;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching the timezone list. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getTimezoneList>(getTimezoneList);
