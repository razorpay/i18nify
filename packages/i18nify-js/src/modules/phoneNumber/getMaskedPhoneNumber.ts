import getDialCodeByCountryCode from './getDialCodeByCountryCode';
import { withErrorBoundary } from '../../common/errorBoundary';
import PHONE_FORMATTER_MAPPER from './data/phoneFormatterMapper.json';
import {
  cleanPhoneNumber,
  detectCountryAndDialCodeFromPhone,
  replaceFirstXsWithChars,
  replaceLastXsWithChars,
} from './utils';
import { GetMaskedPhoneNumberOptions } from './types';
import { MaskingStyle } from './constants';

/**
 * Generates a masked phone number based on provided options.
 * This function handles the complexity of different phone number formats and
 * masking preferences such as complete masking or partial masking of digits.
 *
 * @param {GetMaskedPhoneNumberOptions} options - Options for generating the masked phone number.
 * @param {CountryCodeType} options.countryCode - The country code associated with the phone number.
 * @param {boolean} options.withDialCode - Determines if the dial code should be included in the masked number.
 * @param {string} options.phoneNumber - The actual phone number to mask.
 * @param {MaskingOptions} options.maskingOptions - Options to specify how the masking should be performed.
 * @returns {string} The masked phone number formatted as per the specified options.
 * @throws {Error} Throws an error if both countryCode and phoneNumber are empty or if other input validations fail.
 */
const getMaskedPhoneNumber = ({
  countryCode,
  withDialCode = true,
  phoneNumber,
  maskingOptions = {},
}: GetMaskedPhoneNumberOptions) => {
  const {
    maskingStyle = MaskingStyle.Full,
    maskedDigitsCount = 0,
    maskingChar = 'x',
  } = maskingOptions;

  if (!countryCode && !phoneNumber) {
    throw new Error('Either countryCode or phoneNumber is mandatory.');
  }

  let maskedContactNumber: string;

  if (phoneNumber) {
    // Clean the phone number to remove any non-numeric characters, except the leading '+'
    let updatedPhoneNumber = phoneNumber;
    updatedPhoneNumber = updatedPhoneNumber.toString();
    updatedPhoneNumber = cleanPhoneNumber(updatedPhoneNumber);

    // Detect the country code and dial code from the cleaned phone number
    const countryData = detectCountryAndDialCodeFromPhone(updatedPhoneNumber);
    const updatedCountryCode = countryCode || countryData.countryCode;

    // Get the phone number formatting template based on the country code
    let formattingTemplate = PHONE_FORMATTER_MAPPER[updatedCountryCode];

    // Apply full masking to the phone number if it lacks a dialCode, without formatting the phone number.
    if (!formattingTemplate) {
      return updatedPhoneNumber.replace(/./g, maskingChar);
    }

    maskedContactNumber = formattingTemplate;

    // If not complete masking, calculate the masked phone number based on the masking options
    if (maskingStyle !== MaskingStyle.Full) {
      const dialCode = countryData.dialCode;
      const phoneNumberWithoutDialCode = updatedPhoneNumber.slice(
        dialCode.toString().length,
      );

      // Validate the masked digits count against the phone number length
      if (
        maskedDigitsCount &&
        maskedDigitsCount > phoneNumberWithoutDialCode.length
      ) {
        maskedContactNumber = PHONE_FORMATTER_MAPPER[countryCode];
      } else {
        // Apply the masking characters to the phone number based on prefix or suffix masking
        if (maskingStyle === MaskingStyle.Prefix) {
          // Example: 7394926646 --> xxxx 926646
          maskedContactNumber = replaceLastXsWithChars(
            formattingTemplate,
            String(phoneNumberWithoutDialCode),
            phoneNumberWithoutDialCode.length - maskedDigitsCount,
          ).replace(/x/g, maskingChar);
        } else if (maskingStyle === MaskingStyle.Suffix) {
          // Example: 7394926646 --> 7494 92xxxx
          maskedContactNumber = replaceFirstXsWithChars(
            formattingTemplate,
            String(phoneNumberWithoutDialCode),
            phoneNumberWithoutDialCode.length - maskedDigitsCount,
          ).replace(/x/g, maskingChar);
        } else if (maskingStyle === MaskingStyle.Alternate) {
          // Example: 7394926646 --> 7x9x 9x6x4x
          maskedContactNumber = String(phoneNumberWithoutDialCode)
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
            .result.join('')
            .replace(/x/g, maskingChar);
        }
      }
    }
  } else {
    // Retrieve the phone number formatting template using the country code
    maskedContactNumber = PHONE_FORMATTER_MAPPER[countryCode];
    if (!maskedContactNumber) {
      throw new Error(`Parameter "countryCode" is invalid: ${countryCode}`);
    }
  }

  // Include the dial code in the masked phone number if requested
  if (withDialCode) {
    const dialCode = getDialCodeByCountryCode(countryCode);
    return `${dialCode} ${maskedContactNumber.replace(/x/g, maskingChar)}`;
  } else {
    return maskedContactNumber.replace(/x/g, maskingChar);
  }
};

export default withErrorBoundary<typeof getMaskedPhoneNumber>(
  getMaskedPhoneNumber,
);
