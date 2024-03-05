import { withErrorBoundary } from '../../common/errorBoundary';
import { CountryCodeType } from '../types/geo';
import { PHONE_FORMATTER_MAPPER } from './data/phoneFormatterMapper';
import { detectCountryAndDialCodeFromPhone, cleanPhoneNumber } from './utils';

// Formats a provided phone number according to the predefined format for a specific country code, or auto-detects the country code and formats the number accordingly.
const formatPhoneNumber = (
  phoneNumber: string | number,
  countryCode?: CountryCodeType,
): string => {
  // Throw errors if phoneNumber is invalid
  if (!phoneNumber) throw new Error('Parameter `phoneNumber` is invalid!');

  // Convert phoneNumber to string and clean it by removing non-numeric characters
  phoneNumber = phoneNumber.toString();
  phoneNumber = cleanPhoneNumber(phoneNumber);

  // Detect or validate the country code
  countryCode = (
    countryCode && countryCode in PHONE_FORMATTER_MAPPER
      ? countryCode
      : detectCountryAndDialCodeFromPhone(phoneNumber).countryCode
  ) as CountryCodeType;

  // Fetch the pattern for the countryCode from the PHONE_FORMATTER_MAPPER
  const pattern = PHONE_FORMATTER_MAPPER[countryCode];

  if (!pattern) return phoneNumber;

  // Count the number of 'x' characters in the format pattern
  let charCountInFormatterPattern = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 'x') {
      charCountInFormatterPattern++;
    }
  }

  // Calculate the difference between phoneNumber length and 'x' characters count in pattern
  const diff = phoneNumber.length - charCountInFormatterPattern;
  // Extract the phoneNumber without the prefix
  const phoneNumberWithoutPrefix = phoneNumber.slice(diff);
  const formattedNumber: string[] = [];
  let numberIndex = 0;

  // Loop through the pattern to format the phoneNumber
  for (let i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    if (patternChar === 'x') {
      // Insert phoneNumber digits at 'x' positions
      if (numberIndex < phoneNumberWithoutPrefix.length) {
        formattedNumber.push(phoneNumberWithoutPrefix[numberIndex]);
        numberIndex++;
      }
    } else {
      // Insert non-digit characters from the pattern
      formattedNumber.push(patternChar);
    }
  }

  // Join the formattedNumber array to create the formattedPhoneNumber without prefix
  const formattedPhoneNumberWithoutPrefix = formattedNumber.join('');
  // Combine the prefix and formattedPhoneNumberWithoutPrefix
  const formattedPhoneNumberWithPrefix =
    phoneNumber.slice(0, diff) + ' ' + formattedPhoneNumberWithoutPrefix;

  // Return the formattedPhoneNumber with prefix after trimming whitespace
  return formattedPhoneNumberWithPrefix.trim();
};

export default withErrorBoundary<typeof formatPhoneNumber>(formatPhoneNumber);
