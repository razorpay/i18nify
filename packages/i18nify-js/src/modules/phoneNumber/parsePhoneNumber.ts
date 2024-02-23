import { withErrorBoundary } from '../../common/errorBoundary';
import { PHONE_FORMATTER_MAPPER } from './data/phoneFormatterMapper';
import formatPhoneNumber from './formatPhoneNumber';
import { detectCountryCodeFromDialCode, cleanPhoneNumber } from './utils';

interface PhoneInfo {
  countryCode: string;
  dialCode: string;
  formattedPhoneNumber: string;
  formatTemplate: string;
}

// Parses a given phone number, identifies its country code (if not provided), and returns an object with details including the country code, formatted phone number, dial code, and format template.
const parsePhoneNumber = (phoneNumber: string, country?: string): PhoneInfo => {
  // Throw errors if phoneNumber is invalid
  if (!phoneNumber) throw new Error(`Parameter 'phoneNumber' is invalid: ${phoneNumber}`);

  // Clean the phoneNumber by removing non-numeric characters
  phoneNumber = phoneNumber.toString();
  phoneNumber = cleanPhoneNumber(phoneNumber);

  // Detect or validate the country code
  const countryCode =
    country && country in PHONE_FORMATTER_MAPPER
      ? country
      : detectCountryCodeFromDialCode(phoneNumber);

  // Format the phone number using the detected/validated country code
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber, countryCode);

  // Fetch the pattern associated with the countryCode from the PHONE_FORMATTER_MAPPER
  const pattern = PHONE_FORMATTER_MAPPER[countryCode];

  if (!pattern)
    return {
      countryCode: countryCode || '',
      dialCode: '',
      formattedPhoneNumber: phoneNumber,
      formatTemplate: '',
    };

  // Count the number of 'x' characters in the format pattern
  let charCountInFormatterPattern = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 'x') {
      charCountInFormatterPattern++;
    }
  }

  // Calculate the difference between phoneNumber length and 'x' characters count in pattern
  const diff = phoneNumber.length - charCountInFormatterPattern;

  // Extract the dialCode from the phoneNumber
  const dialCode = phoneNumber.slice(0, diff);

  // Obtain the format template associated with the countryCode
  const formatTemplate = PHONE_FORMATTER_MAPPER[countryCode];

  // Return the parsed phone number information
  return {
    countryCode,
    formattedPhoneNumber,
    dialCode,
    formatTemplate,
  };
};

export default withErrorBoundary<typeof parsePhoneNumber>(parsePhoneNumber);
