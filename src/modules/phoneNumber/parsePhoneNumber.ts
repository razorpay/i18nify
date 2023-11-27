import { withErrorBoundary } from '../../common/errorBoundary';
import { PHONE_FORMATTER_MAPPER } from './data/phoneFormatterMapper';
import formatPhoneNumber from './formatPhoneNumber';
import { detectCountryCodeFromDialCode, cleanPhoneNumber } from './utils';

interface PhoneInfo {
  countryCode: string;
  dialCode: string;
  formattedPhoneNumber: string;
  formatTemplate: string;
}

const parsePhoneNumber = (
  phoneNumber: string,
  country?: string,
): PhoneInfo | null => {
  const countryCode =
    country in Object.keys(PHONE_FORMATTER_MAPPER)
      ? country
      : detectCountryCodeFromDialCode(phoneNumber);
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber, countryCode);
  const pattern = PHONE_FORMATTER_MAPPER[countryCode];

  if (!pattern) throw new Error('Parameter `countryCode` is invalid!');
  if (!phoneNumber) throw new Error('Parameter `phoneNumber` is invalid!');

  phoneNumber = phoneNumber.toString();
  phoneNumber = cleanPhoneNumber(phoneNumber);

  let charCountInFormatterPattern = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 'x') {
      charCountInFormatterPattern++;
    }
  }

  const diff = phoneNumber.length - charCountInFormatterPattern;
  const dialCode = phoneNumber.slice(0, diff);
  const formatTemplate = PHONE_FORMATTER_MAPPER[countryCode];

  return {
    countryCode,
    formattedPhoneNumber,
    dialCode,
    formatTemplate,
  };
};

export default withErrorBoundary<typeof parsePhoneNumber>(parsePhoneNumber);
