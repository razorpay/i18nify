import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_CODE } from './types';

/**
 * Returns cities for the provided state_code
 * For eg, 
 * getCitiesByState('DL') => [
      "Pitampura",
      "Pahar Ganj",
      "Dwarka",
      "Libaspur",
      "Burari",
      "Punjabi Bagh",
      "Moti Bagh",
      "Gharroli",
      "Rohini",
      "Saket",
      ...
    ]
 */
const getCitiesByState = async (
  countryCode: COUNTRY_CODE,
  stateCode: string,
) => {
  // TODO: Replace this with hosted json config
  if (!countryCode || !stateCode) {
    throw new Error(`Invalid parameters = ${countryCode}, ${stateCode}`);
  }
  const res = await fetch(`./${countryCode.toUpperCase()}.json`).then((res) =>
    res.json(),
  );
  if (!res?.states?.[stateCode]) {
    throw new Error('Error fetching data');
  }
  return res.states[stateCode].cities;
};

export default withErrorBoundary<typeof getCitiesByState>(getCitiesByState);
