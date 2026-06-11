import { withErrorBoundary } from '../../common/errorBoundary';
import STATES_DATA from './data/statesGlobalData.json';
import type { StatesByCountriesMap } from './types';

const getStatesByCountriesMap = (): StatesByCountriesMap => {
  return STATES_DATA as StatesByCountriesMap;
};

export default withErrorBoundary<typeof getStatesByCountriesMap>(
  getStatesByCountriesMap,
);
