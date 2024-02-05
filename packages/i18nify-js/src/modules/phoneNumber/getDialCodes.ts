import { withErrorBoundary } from '../../common/errorBoundary';
import { DIAL_CODE_MAPPER } from './data/dialCodeMapper';

/**
 * Retrieves a mapping of country codes to their respective international dial codes.
 * @returns {Object} An object where each key is a country code (e.g., 'US', 'CA') and its value is the corresponding dial code (e.g., '+1' for 'US' and 'CA').
 */
const getDialCodes = (): { [key: string]: string } => {
  const countryDialCode: { [key: string]: string } = {};

  for (const [dialCode, countryCodes] of Object.entries(DIAL_CODE_MAPPER)) {
    countryCodes.forEach((countryCode) => {
      countryDialCode[countryCode] = `+${Number(dialCode)}`;
    });
  }

  return countryDialCode;
};

export default withErrorBoundary<typeof getDialCodes>(getDialCodes);
