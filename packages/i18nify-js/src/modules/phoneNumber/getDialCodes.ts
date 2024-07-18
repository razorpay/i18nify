import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import DIAL_CODE_MAPPER from '#/i18nify-data/phone-number/dial-code-to-country/data.json';

/**
 * Retrieves a mapping of country codes to their respective international dial codes.
 * @returns {Object} An object where each key is a country code (e.g., 'US', 'CA') and its value is the corresponding dial code (e.g., '+1' for 'US' and 'CA').
 */
const getDialCodes = (): { [key in CountryCodeType]: string } => {
  const countryDialCode: { [key in CountryCodeType]: string } = {} as any;

  for (const [dialCode, countryCodes] of Object.entries(
    DIAL_CODE_MAPPER.dial_code_to_country,
  )) {
    countryCodes.forEach((countryCode) => {
      countryDialCode[countryCode as CountryCodeType] = `+${Number(dialCode)}`;
    });
  }

  return countryDialCode;
};

export default withErrorBoundary<typeof getDialCodes>(getDialCodes);
