import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import getDialCodeByCountryCode from './getDialCodeByCountryCode';
import { cleanPhoneNumber } from './utils';

// Strips the international dial code from phoneNumber and returns the national subscriber number.
// If phoneNumber has no leading '+', it is already a national number and is returned cleaned.
// Throws when phoneNumber carries a '+' prefix that does not match the dial code for countryCode.
const stripDialCode = (
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
        `Phone number "${phoneNumber}" does not start with dial code ${dialCode} for country "${countryCode}".`,
      );
    }
    return cleaned.slice(1 + callingDigits.length);
  }

  return cleaned;
};

export default withErrorBoundary<typeof stripDialCode>(stripDialCode);
