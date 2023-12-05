import { dialCodeMapper } from './data/dialCodeMapper';
import { PHONE_REGEX_MAPPER } from './data/phoneRegexMapper';

export const detectCountryCodeFromDialCode = (
  phoneNumber: string | number,
): string => {
  if (phoneNumber.toString().charAt(0) === '+') {
    const cleanedPhoneNumberWithoutPlusPrefix = phoneNumber
      .toString()
      .replace(/\D/g, '');

    const matchingCountries: string[] = [];

    for (const code in dialCodeMapper) {
      if (cleanedPhoneNumberWithoutPlusPrefix.startsWith(code)) {
        matchingCountries.push(...dialCodeMapper[code]);
      }
    }

    const matchedCountryCodes = matchingCountries.map((countryCode: string) => {
      const regex = PHONE_REGEX_MAPPER[countryCode];
      if (regex && regex.test(phoneNumber.toString())) {
        return countryCode;
      }
    });

    return matchedCountryCodes[0];
  } else {
    for (const countryCode in PHONE_REGEX_MAPPER) {
      if (countryCode in PHONE_REGEX_MAPPER) {
        const regex = PHONE_REGEX_MAPPER[countryCode];
        if (regex.test(phoneNumber.toString())) {
          return countryCode;
        }
      }
    }
  }

  return '';
};

export const cleanPhoneNumber = (phoneNumber: string) => {
  // Regular expression to match all characters except numbers and + sign at the start
  const regex = /[^0-9+]|(?!A)\+/g;
  // Replace matched characters with an empty string
  const cleanedPhoneNumber = phoneNumber.replace(regex, '');
  return phoneNumber[0] === '+' ? `+${cleanedPhoneNumber}` : cleanedPhoneNumber;
};
