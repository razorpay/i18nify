import { withErrorBoundary } from '../../common/errorBoundary';
import { JSON_BASE_URL } from './constants';

/**
 * Returns list of all countries from all continents
 * For eg, 
 * getAllCountries() => 
[
    {
        "code": "AO",
        "name": "Angola"
    },
    {
        "code": "BF",
        "name": "Burkina Faso"
    },
    {
        "code": "BI",
        "name": "Burundi"
    },
    {
        "code": "BJ",
        "name": "Benin"
    },...
]
}
 */
const getAllCountries = () => {
  // TODO: Replace this with hosted json config
  return fetch(`${JSON_BASE_URL}/continents.json`)
    .then((res) => res.json())
    .then((res) => {
      return Object.keys(res).reduce((acc, curr) => {
        // @ts-expect-error ignore
        acc = [...acc, ...res[curr].countries];
        return acc;
      }, []);
    });
};

export default withErrorBoundary<typeof getAllCountries>(getAllCountries);
