import { withErrorBoundary } from '../../common/errorBoundary';
import STATES_DATA from './data/statesGlobalData.json';
import type { CountrySubdivisionData } from './types';

const data = STATES_DATA as Record<string, CountrySubdivisionData>;

const getStatesByCountry = (countryCode: string): CountrySubdivisionData => {
  if (!countryCode || typeof countryCode !== 'string') {
    throw new Error('countryCode must be a non-empty string.');
  }
  const cc = countryCode.trim().toUpperCase();
  if (!(cc in data)) {
    throw new Error(
      `No subdivision data found for country code: "${cc}". Pass a valid ISO 3166-1 alpha-2 code.`,
    );
  }
  return data[cc];
};

export default withErrorBoundary<typeof getStatesByCountry>(getStatesByCountry);
