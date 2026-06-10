import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { I18NIFY_DATA_SOURCE } from '../shared';
import { CountryMetaType } from './types';

/**
 * Normalises a timezone input into a comparable UTC offset string.
 *
 * Accepts either:
 *  - An IANA timezone name (e.g. "Asia/Kolkata", "America/New_York")
 *  - A UTC offset string in any of these formats:
 *      "+05:30", "-04:00", "UTC +05:30", "UTC+5:30", "UTC -04:00"
 *
 * Returns a string in the canonical form "UTC +HH:MM" / "UTC -HH:MM" / "UTC +00:00",
 * matching the format stored in i18nify-data.
 * Returns null when the input cannot be resolved.
 */
function normaliseToUtcOffset(timezone: string): string | null {
  const trimmed = timezone.trim();

  // --- 1. Try to treat it as an IANA timezone via Intl API ---
  try {
    // Intl.DateTimeFormat throws a RangeError for unknown zone names.
    const fmt = new Intl.DateTimeFormat('en', {
      timeZone: trimmed,
      timeZoneName: 'longOffset',
    });
    const parts = fmt.formatToParts(new Date());
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');
    if (offsetPart) {
      // longOffset produces strings like "GMT+05:30" or "GMT-04:00" or "GMT"
      const raw = offsetPart.value.replace(/^GMT/, '');
      if (raw === '') return 'UTC +00:00';
      const sign = raw[0] === '-' ? '-' : '+';
      const body = raw.replace(/^[+-]/, '');
      const [hStr, mStr = '00'] = body.split(':');
      const h = String(parseInt(hStr, 10)).padStart(2, '0');
      const m = String(parseInt(mStr, 10)).padStart(2, '0');
      return `UTC ${sign}${h}:${m}`;
    }
  } catch {
    // not a valid IANA name – fall through to offset parsing
  }

  // --- 2. Try to parse a raw UTC offset string ---
  // Strip optional leading "UTC" and whitespace
  const stripped = trimmed.replace(/^UTC\s*/i, '').trim();
  const match = stripped.match(/^([+-]?)(\d{1,2}):(\d{2})$/);
  if (match) {
    const sign = match[1] === '-' ? '-' : '+';
    const h = String(parseInt(match[2], 10)).padStart(2, '0');
    const m = String(parseInt(match[3], 10)).padStart(2, '0');
    return `UTC ${sign}${h}:${m}`;
  }

  return null;
}

/**
 * Returns the list of country codes whose timezone data includes the given
 * timezone or UTC offset.
 *
 * This is the reverse of the country → timezone mapping and is useful for
 * auto-detecting a user's locale from the browser's reported timezone:
 *
 * ```ts
 * const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // "Asia/Kolkata"
 * const countries = await getCountriesByTimezone(tz); // ["IN"]
 * ```
 *
 * @param timezone - An IANA timezone name (e.g. "Asia/Kolkata") **or** a UTC
 *   offset string in any common format (e.g. "+05:30", "UTC +05:30",
 *   "UTC-4:00").  When an IANA name is supplied it is matched directly against
 *   the timezone keys in the data; the UTC offset is used as a fallback so
 *   that aliases that share the same offset are also captured.
 * @returns Promise resolving to an array of {@link CountryCodeType} strings.
 *   Returns an empty array when no match is found.
 */
const getCountriesByTimezone = (timezone: string): Promise<CountryCodeType[]> => {
  if (!timezone || !timezone.trim()) {
    throw new Error('timezone parameter is required and must not be empty.');
  }

  const normalisedOffset = normaliseToUtcOffset(timezone.trim());
  const ianaName = timezone.trim();

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((res) => res.json())
    .then((res: { metadata_information: Record<string, CountryMetaType> }) => {
      const metadata = res.metadata_information;
      const matched: CountryCodeType[] = [];

      for (const countryCode of Object.keys(metadata) as CountryCodeType[]) {
        const { timezones } = metadata[countryCode];
        if (!timezones) continue;

        const hasDirectMatch = Object.keys(timezones).some(
          (tz) => tz === ianaName,
        );

        const hasOffsetMatch =
          normalisedOffset !== null &&
          Object.values(timezones).some(
            (tzData) => tzData.utc_offset === normalisedOffset,
          );

        if (hasDirectMatch || hasOffsetMatch) {
          matched.push(countryCode);
        }
      }

      return matched;
    })
    .catch((err: Error) => {
      throw new Error(
        `An error occurred while fetching timezone to country mapping. The error details are: ${err.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getCountriesByTimezone>(
  getCountriesByTimezone,
);
