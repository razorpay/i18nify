import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

/**
 * Normalises a UTC offset string to the canonical format used in i18nify-data
 * (e.g. "UTC +05:30"). Accepts both "+05:30" and "UTC +05:30" as input.
 * Returns null when the format is unrecognised.
 */
const normaliseUtcOffset = (utcOffset: string): string | null => {
  const trimmed = utcOffset.trim();
  if (/^UTC\s[+-]/.test(trimmed)) return trimmed;
  if (/^[+-]\d/.test(trimmed)) return `UTC ${trimmed}`;
  return null;
};

/**
 * Returns the list of country codes whose timezone data contains the given UTC offset.
 *
 * This is the reverse of the country→timezone mapping — given a UTC offset
 * (obtained e.g. from the browser via `Intl.DateTimeFormat().resolvedOptions()`)
 * you can determine which countries share that offset and use it to infer the
 * user's locale automatically.
 *
 * @param utcOffset - UTC offset string, e.g. "+05:30" or "UTC +05:30"
 * @returns Promise resolving to an array of CountryCodeType values
 *
 * @example
 * // Browser-based auto-locale detection
 * const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone; // "Asia/Kolkata"
 * const offsetMins = new Date().getTimezoneOffset(); // -330
 * const h = Math.abs(Math.floor(offsetMins / 60)).toString().padStart(2, '0');
 * const m = Math.abs(offsetMins % 60).toString().padStart(2, '0');
 * const sign = offsetMins <= 0 ? '+' : '-';
 * const offset = `${sign}${h}:${m}`; // "+05:30"
 * const countries = await getCountriesByUtcOffset(offset); // ["IN", "LK"]
 */
const getCountriesByUtcOffset = (
  utcOffset: string,
): Promise<CountryCodeType[]> => {
  const normalisedOffset = normaliseUtcOffset(utcOffset);
  if (!normalisedOffset) {
    return Promise.reject(
      new Error(
        `Invalid UTC offset format: "${utcOffset}". Expected formats: "+05:30" or "UTC +05:30".`,
      ),
    );
  }

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then((res: { metadata_information: Record<string, CountryMetaType> }) => {
      const countries: CountryCodeType[] = [];
      for (const [countryCode, meta] of Object.entries(
        res.metadata_information,
      )) {
        const hasOffset = Object.values(meta.timezones ?? {}).some(
          (tz) => tz.utc_offset === normalisedOffset,
        );
        if (hasOffset) {
          countries.push(countryCode as CountryCodeType);
        }
      }
      return countries;
    })
    .catch((err) => {
      throw new Error(
        `An error occurred while fetching countries for UTC offset "${utcOffset}". The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getCountriesByUtcOffset>(
  getCountriesByUtcOffset,
);
