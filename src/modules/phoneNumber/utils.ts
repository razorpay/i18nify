import { PHONE_REGEX_MAPPER } from './data/phoneRegexMapper';

export const detectCountryCodeFromDialCode = (
  phoneNumber: string | number,
): string => {
  phoneNumber = cleanPhoneNumber(phoneNumber.toString());
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

export const cleanPhoneNumber = (phoneNumber: string) => {
  // Regular expression to match all characters except numbers
  const regex = /[^0-9+]|(?!A)\+/g;
  // Replace matched characters with an empty string
  const cleanedPhoneNumber = phoneNumber.replace(regex, '');
  return phoneNumber[0] === '+' ? `+${cleanedPhoneNumber}` : cleanedPhoneNumber;
};
