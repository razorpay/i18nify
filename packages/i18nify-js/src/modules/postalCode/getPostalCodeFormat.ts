import { withErrorBoundary } from '../../common/errorBoundary';
import POSTAL_CODE_DATA from './data/postalCodeData.json';
import type { PostalCodeInfo } from './types';

const data = POSTAL_CODE_DATA as Record<string, PostalCodeInfo>;

const getPostalCodeFormat = (countryCode: string): PostalCodeInfo => {
  if (!countryCode || typeof countryCode !== 'string') {
    throw new Error('countryCode must be a non-empty string.');
  }
  const cc = countryCode.trim().toUpperCase();
  if (!(cc in data)) {
    throw new Error(
      `No postal code data found for country code: "${cc}". Pass a valid ISO 3166-1 alpha-2 code.`,
    );
  }
  return data[cc];
};

export default withErrorBoundary<typeof getPostalCodeFormat>(
  getPostalCodeFormat,
);
