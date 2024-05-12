import getDialCodeByCountryCode from './getDialCodeByCountryCode';
import { withErrorBoundary } from '../../common/errorBoundary';
import PHONE_FORMATTER_MAPPER from './data/phoneFormatterMapper.json';
import { cleanPhoneNumber, detectCountryAndDialCodeFromPhone } from './utils';
import { GetMaskedPhoneNumberOptions } from './types';

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
  maskingOptions = {
    completeMasking: true,
    prefixMasking: true,
    maskedDigitsCount: 0,
    maskingChar: 'x',
  },
}: GetMaskedPhoneNumberOptions) => {
  if (!countryCode && !phoneNumber) {
    throw new Error('Both countryCode and phoneNumber cannot be empty.');
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
    const formattingTemplate = PHONE_FORMATTER_MAPPER[updatedCountryCode];

    if (!formattingTemplate) {
      throw new Error(`Parameter "phoneNumber" is invalid: ${phoneNumber}`);
    }

    maskedContactNumber = formattingTemplate;

    // If not complete masking, calculate the masked phone number based on the masking options
    if (!maskingOptions.completeMasking) {
      const dialCode = countryData.dialCode;
      const phoneNumberWithoutDialCode = updatedPhoneNumber.slice(
        dialCode.toString().length,
      );

      // Validate the masked digits count against the phone number length
      if (
        maskingOptions.maskedDigitsCount &&
        maskingOptions.maskedDigitsCount > phoneNumberWithoutDialCode.length
      ) {
        throw new Error(
          `maskedDigitsCount exceeds phone number length. Value of "maskedDigitsCount" is ${maskingOptions.maskedDigitsCount}`,
        );
      }

      // Apply the masking characters to the phone number based on prefix or suffix masking
      if (maskingOptions.prefixMasking) {
        maskedContactNumber =
          maskingOptions.maskingChar.repeat(maskingOptions.maskedDigitsCount) +
          phoneNumberWithoutDialCode.slice(maskingOptions.maskedDigitsCount);
      } else {
        maskedContactNumber =
          phoneNumberWithoutDialCode.slice(
            0,
            -maskingOptions.maskedDigitsCount,
          ) +
          maskingOptions.maskingChar.repeat(maskingOptions.maskedDigitsCount);
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
    return `${dialCode} ${maskedContactNumber}`;
  } else {
    return maskedContactNumber;
  }
};

export default withErrorBoundary<typeof getMaskedPhoneNumber>(
  getMaskedPhoneNumber,
);
