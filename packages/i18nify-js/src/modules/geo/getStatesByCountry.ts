import { withErrorBoundary } from '../../common/errorBoundary';
import { COUNTRY_CODE } from './types';

/**
 * Returns states for the provided country_code 
 * For eg, 
 * getStatesByCountry('IN') => {
    "TN": {
      "name": "Tamil Nadu",
      "cities": [
        "Sengottai",
        "Kandamanadi",
        "Kallakurichi"...
      ]
    },
    "UP": {
      "name": "Uttar Pradesh",
      "cities": [
        "Zamānia",
        "Zafarābād",
        "Vrindāvan",
        "Varanasi",
      ]
    },
    ...
  }
 */
const getStatesByCountry = async (countryCode: COUNTRY_CODE) => {
  if (!countryCode) {
    throw new Error(`Invalid country code = ${countryCode}`);
  }
  // TODO: Replace this with hosted json config
  const data = await fetch(`./${countryCode.toUpperCase()}.json`).then((res) =>
    res.json(),
  );
  if (!data?.states) {
    throw new Error('Error fetching data');
  }
  return data.states;
};

export default withErrorBoundary<typeof getStatesByCountry>(getStatesByCountry);
