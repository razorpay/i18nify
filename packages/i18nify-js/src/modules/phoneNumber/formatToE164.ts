import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types';
import { cleanPhoneNumber } from './utils';
import getDialCodeByCountryCode from './getDialCodeByCountryCode';

// Formats a phone number to E.164 international format (+[country code][subscriber number]).
// If the number already contains a dial code (starts with '+'), it is normalised in place.
// When no dial code is present a countryCode must be supplied to determine the prefix.
const formatToE164 = (
  phoneNumber: string | number,
  countryCode?: CountryCodeType,
): string => {
  if (!phoneNumber)
    throw new Error(
      `Parameter 'phoneNumber' is invalid! The received value was: ${phoneNumber}. Please ensure you provide a valid phone number.`,
    );

  const phoneStr = cleanPhoneNumber(phoneNumber.toString());

  if (phoneStr.startsWith('+')) {
    // Already carries a dial code — cleanPhoneNumber has already stripped formatting characters.
    return phoneStr;
  }

  if (!countryCode)
    throw new Error(
      `Unable to determine dial code for: ${phoneNumber}. Provide a countryCode or include a dial code prefix (e.g. '+91...').`,
    );

  const dialCode = getDialCodeByCountryCode(countryCode);
  const nationalDigits = phoneStr.replace(/\D/g, '');
  return `${dialCode}${nationalDigits}`;
};

export default withErrorBoundary<typeof formatToE164>(formatToE164);
