import PHONE_REGEX_MAPPER from '#/i18nify-data/phone-number/country-code-to-phone-number/data.json';
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

  const regexMapper = PHONE_REGEX_MAPPER.country_tele_information;
  // Detect or validate the country code
  countryCode = (
    countryCode && countryCode in regexMapper
      ? countryCode
      : detectCountryAndDialCodeFromPhone(cleanedPhoneNumber).countryCode
  ) as CountryCodeType;

  // Return false if phoneNumber is empty
  if (!phoneNumber) return false;

  // Check if the countryCode exists in the PHONE_REGEX_MAPPER
  if (countryCode in regexMapper) {
    // Fetch the regex pattern for the countryCode
    const regex = new RegExp(regexMapper[countryCode].regex);
    // Test if the cleanedPhoneNumber matches the regex pattern
    return regex.test(cleanedPhoneNumber as string);
  }

  // Return false if the countryCode is not supported
  return false;
};

export default withErrorBoundary<typeof isValidPhoneNumber>(isValidPhoneNumber);
