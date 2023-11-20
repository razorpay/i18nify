import { PHONE_REGEX_MAPPER } from './data/phoneRegexMapper';

export const detectCountryCodeFromDialCode = (
  phoneNumber: string | number,
): string => {
  for (const countryCode in PHONE_REGEX_MAPPER) {
    if (Object.prototype.hasOwnProperty.call(PHONE_REGEX_MAPPER, countryCode)) {
      const regex = PHONE_REGEX_MAPPER[countryCode];
      if (regex.test(phoneNumber.toString())) {
        return countryCode;
      }
    }
  }
  throw new Error('Unable to detect `country code` from phone number.');
};

export const removeNonNumericChars = (phoneNumber: string) => {
  // Regular expression to match all characters except numbers and + sign at the start
  const regex = /[^0-9+]|(?!\A)\+/g;
  // Replace matched characters with an empty string
  const cleanedString = phoneNumber.replace(regex, '');
  return cleanedString;
};
