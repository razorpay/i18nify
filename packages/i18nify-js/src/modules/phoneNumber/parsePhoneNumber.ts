import { withErrorBoundary } from '../../common/errorBoundary';
import { PHONE_FORMATTER_MAPPER } from './data/phoneFormatterMapper';
import formatPhoneNumber from './formatPhoneNumber';
import { detectCountryAndDialCodeFromPhone, cleanPhoneNumber } from './utils';

interface PhoneInfo {
  countryCode: string;
  dialCode: string;
  formattedPhoneNumber: string;
  formatTemplate: string;
  phoneNumber: string;
}

// Parses a given phone number, identifies its country code (if not provided), and returns an object with details including the country code, formatted phone number, dial code, and format template.
const parsePhoneNumber = (phoneNumber: string, country?: string): PhoneInfo => {
  // Throw errors if phoneNumber is invalid
  if (!phoneNumber) throw new Error('Parameter `phoneNumber` is invalid!');

  // Clean the phoneNumber by removing non-numeric characters
  phoneNumber = phoneNumber.toString();
  phoneNumber = cleanPhoneNumber(phoneNumber);

  const countryData = detectCountryAndDialCodeFromPhone(phoneNumber);
  // Detect or validate the country code
  const countryCode =
    country && country in PHONE_FORMATTER_MAPPER
      ? country
      : countryData.countryCode;

  const dialCode = countryData.dialCode;
  // Format the phone number using the detected/validated country code
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber, countryCode);

  // Fetch the pattern associated with the countryCode from the PHONE_FORMATTER_MAPPER
  const pattern = PHONE_FORMATTER_MAPPER[countryData.countryCode];

  const rawPhoneNumber =
    phoneNumber[0] === '+'
      ? phoneNumber.slice(dialCode.length)
      : phoneNumber.slice(dialCode.length - 1);

  // Obtain the format template associated with the countryCode
  const formatTemplate = PHONE_FORMATTER_MAPPER[countryCode];

  // Return the parsed phone number information
  return {
    phoneNumber: rawPhoneNumber,
    countryCode: countryCode || '',
    dialCode,
    formattedPhoneNumber: pattern ? formattedPhoneNumber : phoneNumber,
    formatTemplate: formatTemplate || '',
  };
};

export default withErrorBoundary<typeof parsePhoneNumber>(parsePhoneNumber);
