import { PHONE_REGEX_MAPPER } from './data/phoneRegexMapper';
import { withErrorBoundary } from '../../common/errorBoundary';
import { detectCountryAndDialCodeFromPhone, cleanPhoneNumber } from './utils';
import { CountryCodeType } from '../types';

// Validates whether a given phone number is valid based on the provided country code or auto-detects the country code and checks if the number matches the defined regex pattern for that country.
const isValidPhoneNumber = (
  phoneNumber: string | number,
  countryCode?: CountryCodeType,
): boolean => {
  // Clean the provided phoneNumber by removing non-numeric characters
  const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber.toString());

  // Detect or validate the country code
  countryCode = (
    countryCode && countryCode in PHONE_REGEX_MAPPER
      ? countryCode
      : detectCountryAndDialCodeFromPhone(cleanedPhoneNumber).countryCode
  ) as CountryCodeType;

  // Return false if phoneNumber is empty
  if (!phoneNumber) return false;

  // Check if the countryCode exists in the PHONE_REGEX_MAPPER
  if (countryCode in PHONE_REGEX_MAPPER) {
    // Fetch the regex pattern for the countryCode
    const regex = PHONE_REGEX_MAPPER[countryCode];
    // Test if the cleanedPhoneNumber matches the regex pattern
    return regex.test(cleanedPhoneNumber as string);
  }

  // Return false if the countryCode is not supported
  return false;
};

export default withErrorBoundary<typeof isValidPhoneNumber>(isValidPhoneNumber);
