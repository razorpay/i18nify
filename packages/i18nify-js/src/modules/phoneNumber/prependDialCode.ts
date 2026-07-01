import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import getDialCodeByCountryCode from './getDialCodeByCountryCode';
import { cleanPhoneNumber } from './utils';

// Prepends the international dial code for countryCode to phoneNumber.
// If phoneNumber already carries the correct '+' prefix it is returned normalised.
// Throws when phoneNumber carries a '+' prefix that belongs to a different country.
const prependDialCode = (
  phoneNumber: string | number,
  countryCode: CountryCodeType,
): string => {
  if (!phoneNumber && phoneNumber !== 0)
    throw new Error(
      `Parameter 'phoneNumber' is invalid! The received value was: ${phoneNumber}.`,
    );
  if (!countryCode)
    throw new Error(
      `Parameter 'countryCode' is invalid! The received value was: ${countryCode}.`,
    );

  const cleaned = cleanPhoneNumber(String(phoneNumber));
  const dialCode = getDialCodeByCountryCode(countryCode); // e.g. "+91"
  const callingDigits = dialCode.slice(1); // e.g. "91"

  if (cleaned.startsWith('+')) {
    if (!cleaned.startsWith('+' + callingDigits)) {
      throw new Error(
        `Phone number "${phoneNumber}" has a different dial code prefix (expected ${dialCode} for country "${countryCode}").`,
      );
    }
    return cleaned;
  }

  return '+' + callingDigits + cleaned;
};

export default withErrorBoundary<typeof prependDialCode>(prependDialCode);
