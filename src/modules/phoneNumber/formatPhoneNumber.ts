import { withErrorBoundary } from '../../common/errorBoundary';
import { PHONE_FORMATTER_MAPPER } from './data/phoneFormatterMapper';
import { detectCountryCodeFromDialCode, removeNonNumericChars } from './utils';

const formatPhoneNumber = (
  phoneNumber: string | number,
  countryCode?: keyof typeof PHONE_FORMATTER_MAPPER,
): string => {
  if (!countryCode) countryCode = detectCountryCodeFromDialCode(phoneNumber);
  const pattern = PHONE_FORMATTER_MAPPER[countryCode];

  if (!pattern) throw new Error('Parameter `countryCode` is invalid!');
  if (!phoneNumber) throw new Error('Parameter `phoneNumber` is invalid!');

  phoneNumber = phoneNumber.toString();
  phoneNumber = removeNonNumericChars(phoneNumber);

  let charCountInFormatterPattern = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 'x') {
      charCountInFormatterPattern++;
    }
  }

  const diff = phoneNumber.length - charCountInFormatterPattern;
  const phoneNumberWithoutPrefix = phoneNumber.slice(diff);
  const formattedNumber: string[] = [];
  let numberIndex = 0;

  for (let i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    if (patternChar === 'x') {
      if (numberIndex < phoneNumberWithoutPrefix.length) {
        formattedNumber.push(phoneNumberWithoutPrefix[numberIndex]);
        numberIndex++;
      }
    } else {
      formattedNumber.push(patternChar);
    }
  }

  const formattedPhoneNumberWithoutPrefix = formattedNumber.join('');
  const formattedPhoneNumberWithPrefix =
    phoneNumber.slice(0, diff) + ' ' + formattedPhoneNumberWithoutPrefix;

  return formattedPhoneNumberWithPrefix.trim();
};

export default withErrorBoundary<typeof formatPhoneNumber>(formatPhoneNumber);
