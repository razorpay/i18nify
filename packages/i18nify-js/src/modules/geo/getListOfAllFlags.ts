import { withErrorBoundary } from '../../common/errorBoundary';
import * as flags from './data/countryFlagSvgs';
import { FlagMap } from './types';

/**
 * Constructs and returns an object mapping country codes to their respective flag SVG content.
 * It iterates over all exported flags from a predefined object and populates a new FlagMap object.
 * 
 * @returns {FlagMap} An object where each key is a country code and each value is the SVG content of that country's flag.
 */
const getListOfAllFlags = (): FlagMap => {
  const flagMap: FlagMap = {};

  Object.keys(flags).forEach((countryCode) => {
    const flagContent: string = (flags as any)[countryCode];
    flagMap[countryCode] = flagContent;
  });

  return flagMap;
};

export default withErrorBoundary<typeof getListOfAllFlags>(getListOfAllFlags);
