import { withErrorBoundary } from '../../common/errorBoundary';
import { JSON_BASE_URL } from './constants';
import { CONTINENT_CODE } from './types';

/**
 * Returns countries for the provided continent_code 
 * For eg, 
 * getCountriesByContinent('AN') => [
      {
        "code": "AQ",
        "name": "Antarctica"
      },
      {
        "code": "BV",
        "name": "Bouvet Island"
      },
      {
        "code": "GS",
        "name": "South Georgia and the South Sandwich Islands"
      },
      {
        "code": "HM",
        "name": "Heard and McDonald Islands"
      },
      {
        "code": "TF",
        "name": "French Southern Territories"
      }
    ]
}
 */
const getCountriesByContinent = async (continentCode: CONTINENT_CODE) => {
  if (!continentCode) {
    throw new Error(`Invalid continent code = ${continentCode}`);
  }
  // TODO: Replace this with hosted json config
  const res = await fetch(`${JSON_BASE_URL}/continents.json`).then((res) =>
    res.json(),
  );

  if (!res[continentCode]) {
    throw new Error('Error fetching data');
  }

  return res[continentCode].countries;
};

export default withErrorBoundary<typeof getCountriesByContinent>(
  getCountriesByContinent,
);
