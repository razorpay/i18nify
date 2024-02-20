import { withErrorBoundary } from '../../common/errorBoundary';
import { JSON_BASE_URL } from './constants';

/**
 * Returns data configuration mapping for continents and countries. 
 * Sample response => 
 * {
  "AF": {
    "name": "Africa",
    "countries": [
      {
        "code": "AO",
        "name": "Angola"
      },
      {
        "code": "BI",
        "name": "Burundi"
      },...
    ]
  },
  "AN": {
    "name": "Antarctica",
    "countries": [
      {
        "code": "AQ",
        "name": "Antarctica"
      },
      {
        "code": "BV",
        "name": "Bouvet Island"
      },...
  }...
}
 */
const getAllContinents = () => {
  // TODO: Replace this with hosted json config
  return fetch(`${JSON_BASE_URL}/continents.json`).then((res) => res.json());
};

export default withErrorBoundary<typeof getAllContinents>(getAllContinents);
