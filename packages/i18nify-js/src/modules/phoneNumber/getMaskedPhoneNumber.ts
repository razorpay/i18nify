import getDialCodeByCountryCode from './getDialCodeByCountryCode';
import { withErrorBoundary } from '../../common/errorBoundary';
import PHONE_FORMATTER_MAPPER from './data/phoneFormatterMapper.json';
import { CountryCodeType } from '../types';

/**
 * Returns a masked phone number based on the country code.
 * It uses predefined mappings to format phone numbers according to the country standards.
 *
 * @param countryCode The ISO 3166-1 alpha-2 country code.
 * @param withDialCode A boolean indicating whether to include the country's dial code in the result. It has a default value of "true"
 * @returns The masked phone number as a string.
 */
const getMaskedPhoneNumber = (
  countryCode: CountryCodeType,
  withDialCode: boolean = true,
): string => {
  // Throw errors if countryCode is invalid
  if (!countryCode)
    throw new Error(`Parameter "countryCode" is invalid: ${countryCode}`);

  // Retrieve the template for the given country code
  const formattingTemplate = PHONE_FORMATTER_MAPPER[countryCode];

  // Check if the country code is valid and a template exists
  if (!formattingTemplate) {
    throw new Error(`Parameter "countryCode" is invalid: ${countryCode}`);
  }

  // If including the dial code, prepend it to the template with a space
  if (withDialCode) {
    const dialCode = getDialCodeByCountryCode(countryCode);
    return `${dialCode} ${formattingTemplate}`;
  }

  // Return the template directly if not including the dial code
  return formattingTemplate;
};

export default withErrorBoundary<typeof getMaskedPhoneNumber>(
  getMaskedPhoneNumber,
);
