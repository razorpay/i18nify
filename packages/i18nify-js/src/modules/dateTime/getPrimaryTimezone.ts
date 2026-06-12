import { withErrorBoundary } from '../../common/errorBoundary';
import { I18NIFY_DATA_SOURCE } from '../shared';

const getPrimaryTimezone = (countryCode: string): Promise<string> => {
  if (!countryCode || !countryCode.trim()) {
    return Promise.reject(
      new Error('getPrimaryTimezone: country code must not be empty.'),
    );
  }

  const normalizedCode = countryCode.trim().toUpperCase();

  return fetch(`${I18NIFY_DATA_SOURCE}/country/metadata/data.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    })
    .then((response) => {
      const countryMeta = response.metadata_information?.[normalizedCode];

      if (!countryMeta) {
        throw new Error(
          `Country code "${normalizedCode}" not found in metadata.`,
        );
      }

      const timezone: string = countryMeta.timezone_of_capital ?? '';

      if (!timezone) {
        throw new Error(
          `No primary timezone found for country code "${normalizedCode}".`,
        );
      }

      return timezone;
    })
    .catch((error) => {
      throw new Error(
        `An error occurred while fetching primary timezone for country "${countryCode}". The error details are: ${error.message}.`,
      );
    });
};

export default withErrorBoundary<typeof getPrimaryTimezone>(getPrimaryTimezone);
