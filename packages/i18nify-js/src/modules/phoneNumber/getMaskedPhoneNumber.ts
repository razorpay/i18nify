import getDialCodeByCountryCode from './getDialCodeByCountryCode';
import { withErrorBoundary } from '../../common/errorBoundary';
import PHONE_FORMATTER_MAPPER from './data/phoneFormatterMapper.json';
import {
  cleanPhoneNumber,
  detectCountryAndDialCodeFromPhone,
  suffixMasking,
  prefixMasking,
  alternateMasking,
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
  let dialCode: string;

  if (phoneNumber) {
    // Clean the phone number to remove any non-numeric characters, except the leading '+'
    let updatedPhoneNumber = phoneNumber;
    updatedPhoneNumber = updatedPhoneNumber.toString();
    updatedPhoneNumber = cleanPhoneNumber(updatedPhoneNumber);

    // Detect the country code and dial code from the cleaned phone number
    const countryData = detectCountryAndDialCodeFromPhone(updatedPhoneNumber);
    const updatedCountryCode = countryCode || countryData.countryCode;
    try {
      dialCode = getDialCodeByCountryCode(updatedCountryCode);
    } catch (error) {
      dialCode = countryData.dialCode;
    }

    // Extract the phone number without dial code
    const phoneNumberWithoutDialCode =
      updatedPhoneNumber[0] === '+'
        ? updatedPhoneNumber.slice(dialCode.toString().length)
        : updatedPhoneNumber;

    // Get the phone number formatting template based on the country code
    let formattingTemplate =
      PHONE_FORMATTER_MAPPER[updatedCountryCode] ||
      phoneNumber.replace(/\d/g, 'x');

    switch (maskingStyle) {
      case MaskingStyle.Alternate:
        // Example: 7394926646 --> 7x9x9x6x4x
        maskedContactNumber = alternateMasking(phoneNumberWithoutDialCode);
        break;
      case MaskingStyle.Prefix:
        // Example: 7394926646 --> xxxx 926646
        maskedContactNumber = prefixMasking(
          formattingTemplate,
          String(phoneNumberWithoutDialCode),
          phoneNumberWithoutDialCode.length - maskedDigitsCount,
        );
        break;
      case MaskingStyle.Suffix:
        // Example: 7394926646 --> 7494 92xxxx
        maskedContactNumber = suffixMasking(
          formattingTemplate,
          String(phoneNumberWithoutDialCode),
          phoneNumberWithoutDialCode.length - maskedDigitsCount,
        );
        break;
      default: // Full Masking Condition
        maskedContactNumber = formattingTemplate;
    }
  } else {
    // Retrieve the phone number formatting template using the country code
    maskedContactNumber = PHONE_FORMATTER_MAPPER[countryCode];
    if (!maskedContactNumber) {
      throw new Error(`Parameter "countryCode" is invalid: ${countryCode}`);
    }
    dialCode = getDialCodeByCountryCode(countryCode);
  }

  // Include the dial code in the masked phone number if requested
  if (withDialCode) {
    return `${dialCode} ${maskedContactNumber.replace(/x/g, maskingChar)}`.trim();
  } else {
    return maskedContactNumber.trim().replace(/x/g, maskingChar);
  }
};

export default withErrorBoundary<typeof getMaskedPhoneNumber>(
  getMaskedPhoneNumber,
);
