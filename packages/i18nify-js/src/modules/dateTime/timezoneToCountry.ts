import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';

const timezoneToCountry = (timezone: string): Promise<string[]> => {
  if (!timezone || !timezone.trim()) {
    return Promise.reject(
      new Error('timezoneToCountry: timezone must not be empty.'),
    );
  }

  const normalizedTimezone = timezone.trim();

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    })
    .then((response) => {
      const metadataInfo: Record<
        string,
        { timezones?: Record<string, unknown> }
      > = response.metadata_information ?? {};
      const countries: string[] = [];

      for (const countryCode of Object.keys(metadataInfo)) {
        const timezones = metadataInfo[countryCode]?.timezones ?? {};

        if (normalizedTimezone in timezones) {
          countries.push(countryCode);
        }
      }

      if (countries.length === 0) {
        throw new Error(
          `Timezone "${normalizedTimezone}" not found in any country metadata.`,
        );
      }

      return countries;
    })
    .catch((error) => {
      throw new Error(
        `An error occurred while fetching country codes for timezone "${timezone}". The error details are: ${error.message}.`,
      );
    });
};

export default withErrorBoundary<typeof timezoneToCountry>(timezoneToCountry);
