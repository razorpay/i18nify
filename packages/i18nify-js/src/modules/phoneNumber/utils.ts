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
      const phoneNumberWithoutDialCode = String(phoneNumber).replace(
        country.dialCode,
        '',
      );

      const regex = new RegExp(
        regexMapper[country.countryCode as CountryCodeType],
      );
      if (regex && regex.test(phoneNumberWithoutDialCode.toString()))
        return country;
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

/**
 * Replaces the first `n` occurrences of 'x' in a source string with the first `n` characters from a replacement string.
 *
 * @param source {string} - The original string where replacements are to be made.
 * @param replacement {string} - The string from which replacement characters are taken.
 * @param n {number} - The number of 'x' characters to replace (unmasked digit count).
 * @returns {string} - The modified string after replacements.
 */
export const suffixMasking = (
  source: string,
  replacement: string,
  n: number,
): string => {
  // Convert the source string into an array of characters for easy manipulation
  let result: string[] = source.split('');
  let replaceIndex: number = 0;
  let replacementsDone: number = 0;

  // Iterate over the result array to replace 'x' with characters from the replacement string
  for (let i = 0; i < result.length && replacementsDone < n; i++) {
    if (result[i] === 'x' && replaceIndex < replacement.length) {
      result[i] = replacement[replaceIndex++];
      replacementsDone++;
    }
  }

  // Join the array back into a string and return the modified result
  return result.join('');
};

/**
 * Replaces the last `n` occurrences of 'x' in a source string with the last `n` characters from a replacement string.
 *
 * @param source {string} - The original string where replacements are to be made.
 * @param replacement {string} - The string from which replacement characters are taken.
 * @param n {number} - The number of 'x' characters to replace from the end of the source string  (unmasked digit count).
 * @returns {string} - The modified string after replacements.
 */
export const prefixMasking = (
  source: string,
  replacement: string,
  n: number,
): string => {
  // Convert the source string into an array of characters for easy manipulation
  let result: string[] = source.split('');
  let replaceIndex: number = replacement.length - 1;
  let replacementsDone: number = 0;

  // Iterate from the end of the source string
  for (let i = result.length - 1; i >= 0 && replacementsDone < n; i--) {
    if (result[i] === 'x' && replaceIndex >= 0) {
      result[i] = replacement[replaceIndex--];
      replacementsDone++;
    }
  }

  // Join the array back into a string and return the modified result
  return result.join('');
};

/**
 * Replaces every alternate digit of phone number with 'x' in phoneNumberWithoutDialCode.
 *
 * @param phoneNumberWithoutDialCode {number | string} - The original phone number without dial code where replacements are to be made.
 * @returns {string} - The modified string after replacements.
 */
export const alternateMasking = (
  phoneNumberWithoutDialCode: number | string,
): string => {
  return String(phoneNumberWithoutDialCode)
    .trim()
    .split('')
    .reduce(
      (acc: any, char: string) => {
        if (/\d/.test(char)) {
          acc.numericCount % 2 !== 0
            ? acc.result.push('x')
            : acc.result.push(char);
          acc.numericCount++;
        }
        return acc;
      },
      { result: [], numericCount: 0 },
    )
    .result.join('');
};
