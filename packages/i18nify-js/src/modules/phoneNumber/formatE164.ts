import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { cleanPhoneNumber } from './utils';
import getDialCodeByCountryCode from './getDialCodeByCountryCode';

const formatE164 = (
  countryCode: CountryCodeType,
  phoneNumber: string | number,
): string => {
  if (!phoneNumber)
    throw new Error(
      `Parameter 'phoneNumber' is invalid! The received value was: ${phoneNumber}.`,
    );
  if (!countryCode)
    throw new Error(
      `Parameter 'countryCode' is invalid! The received value was: ${countryCode}.`,
    );

  const cleaned = cleanPhoneNumber(phoneNumber.toString());
  const dialCode = getDialCodeByCountryCode(countryCode); // e.g. "+91"
  const callingDigits = dialCode.replace('+', ''); // e.g. "91"

  if (cleaned.startsWith('+')) {
    // Phone number already includes an international prefix — normalise it.
    const digits = cleaned.slice(1);
    if (!digits.startsWith(callingDigits)) {
      throw new Error(
        `Phone number "${phoneNumber}" does not match country code "${countryCode}" (expected calling code ${dialCode}).`,
      );
    }
    return `+${digits}`;
  }

  // National number — prepend the calling code.
  return `+${callingDigits}${cleaned}`;
};

export default withErrorBoundary<typeof formatE164>(formatE164);
