import { PHONE_REGEX_MAPPER } from './data/phoneRegexMapper';
import { PHONE_FORMATTER_MAPPER } from './data/phoneFormatterMapper';
import { withErrorBoundary } from '../../common/errorBoundary';
import { detectCountryCodeFromDialCode, cleanPhoneNumber } from './utils';

const isValidPhoneNumber = (
  phoneNumber: string | number,
  countryCode?: keyof typeof PHONE_FORMATTER_MAPPER,
): boolean => {
  const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber.toString());
  if (!countryCode)
    countryCode = detectCountryCodeFromDialCode(cleanedPhoneNumber);
  if (!phoneNumber) throw new Error('Parameter `phoneNumber` is invalid!');

  if (Object.prototype.hasOwnProperty.call(PHONE_REGEX_MAPPER, countryCode)) {
    const regex = PHONE_REGEX_MAPPER[countryCode];
    return regex.test(cleanedPhoneNumber as string);
  }

  // Return false if the country code is not supported
  return false;
};

export default withErrorBoundary<typeof isValidPhoneNumber>(isValidPhoneNumber);
