import { CountryCodeType } from '../types';
import DIAL_CODE_MAPPER from '#/i18nify-data/phone-number/dial-code-to-country/data.json';
import PHONE_REGEX_MAPPER from './data/phoneRegexMapper.json';

/**
 * Determines the country data (countryCode, dialCode) based on the provided phone number.
 * This function employs a multi-step approach to identify the country code:
 * - If the phone number starts with '+', it extracts the numeric characters
 *   and matches the leading digits with known dial codes mapped to countries.
 * - For matched dial codes, it further filters based on country-specific regex patterns
 *   to validate the phone number format for those countries.
 * - If the phone number doesn't start with '+', it returns empty strings as dialCode and countryCode
 *
 * @param phoneNumber The input phone number (string or number).
 * @returns The detected countryCode & dialCode or an empty strings in both if not found.
 */
export const detectCountryAndDialCodeFromPhone = (
  phoneNumber: string | number,
): { countryCode: CountryCodeType; dialCode: string } => {
  const regexMapper = PHONE_REGEX_MAPPER;

  // If the phone number starts with '+', extract numeric characters
  if (phoneNumber.toString().charAt(0) === '+') {
    const cleanedPhoneNumberWithoutPlusPrefix = phoneNumber
      .toString()
      .replace(/\D/g, '');

    const matchingCountries: Array<{
      countryCode: CountryCodeType;
      dialCode: string;
    }> = [];

    const dialCodeMap = DIAL_CODE_MAPPER.dial_code_to_country as Record<
      string,
      CountryCodeType[]
    >;
    // Iterate through dial codes and check for matches with cleaned phone number
    for (const code in dialCodeMap) {
      if (cleanedPhoneNumberWithoutPlusPrefix.startsWith(code)) {
        matchingCountries.push(
          ...(dialCodeMap[code] as string[]).map((item) => ({
            countryCode: item as CountryCodeType,
            dialCode: `+${code}`,
          })),
        );
      }
    }

    // Filter matching countries based on phone number validation regex
    const matchedCountryCode = matchingCountries.find((country) => {
      const regex = new RegExp(
        regexMapper[country.countryCode as CountryCodeType],
      );
      if (regex && regex.test(phoneNumber.toString())) return country;
      return undefined;
    });

    // Return the first matched country code, if any
    return (
      matchedCountryCode || {
        countryCode: '' as CountryCodeType,
        dialCode: '',
      }
    );
  }

  // Return empty string if no country code is detected
  return { countryCode: '' as CountryCodeType, dialCode: '' };
};

export const cleanPhoneNumber = (phoneNumber: string) => {
  // Regular expression to match all characters except numbers and + sign at the start
  const regex = /[^0-9+]|(?!A)\+/g;
  // Replace matched characters with an empty string
  const cleanedPhoneNumber = phoneNumber.replace(regex, '');
  return phoneNumber[0] === '+' ? `+${cleanedPhoneNumber}` : cleanedPhoneNumber;
};
