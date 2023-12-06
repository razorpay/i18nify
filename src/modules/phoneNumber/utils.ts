import { DIAL_CODE_MAPPER } from './data/dialCodeMapper';
import { PHONE_REGEX_MAPPER } from './data/phoneRegexMapper';

/**
 * Determines the country code based on the provided phone number.
 * This function employs a multi-step approach to identify the country code:
 * - If the phone number starts with '+', it extracts the numeric characters
 *   and matches the leading digits with known dial codes mapped to countries.
 * - For matched dial codes, it further filters based on country-specific regex patterns
 *   to validate the phone number format for those countries.
 * - If the phone number doesn't start with '+', it directly matches the number
 *   against regular expressions associated with various countries to identify the code.
 *
 * @param phoneNumber The input phone number (string or number).
 * @returns The detected country code or an empty string if not found.
 */
export const detectCountryCodeFromDialCode = (
  phoneNumber: string | number,
): string => {
  // If the phone number starts with '+', extract numeric characters
  if (phoneNumber.toString().charAt(0) === '+') {
    const cleanedPhoneNumberWithoutPlusPrefix = phoneNumber
      .toString()
      .replace(/\D/g, '');

    const matchingCountries: string[] = [];

    // Iterate through dial codes and check for matches with cleaned phone number
    for (const code in DIAL_CODE_MAPPER) {
      if (cleanedPhoneNumberWithoutPlusPrefix.startsWith(code)) {
        matchingCountries.push(...DIAL_CODE_MAPPER[code]);
      }
    }

    // Filter matching countries based on phone number validation regex
    const matchedCountryCode = matchingCountries.find((countryCode: string) => {
      const regex = PHONE_REGEX_MAPPER[countryCode];
      if (regex && regex.test(phoneNumber.toString())) return countryCode;
      return undefined;
    });

    // Return the first matched country code, if any
    return matchedCountryCode ? matchedCountryCode : '';
  } else {
    // If phone number doesn't start with '+', directly match against country regexes
    for (const countryCode in PHONE_REGEX_MAPPER) {
      const regex = PHONE_REGEX_MAPPER[countryCode];
      if (regex.test(phoneNumber.toString())) {
        return countryCode;
      }
    }
  }

  // Return empty string if no country code is detected
  return '';
};

export const cleanPhoneNumber = (phoneNumber: string) => {
  // Regular expression to match all characters except numbers and + sign at the start
  const regex = /[^0-9+]|(?!A)\+/g;
  // Replace matched characters with an empty string
  const cleanedPhoneNumber = phoneNumber.replace(regex, '');
  return phoneNumber[0] === '+' ? `+${cleanedPhoneNumber}` : cleanedPhoneNumber;
};
