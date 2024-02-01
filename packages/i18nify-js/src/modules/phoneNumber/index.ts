// Exports the phone number utils
export { default as isValidPhoneNumber } from './isValidPhoneNumber';
export { default as formatPhoneNumber } from './formatPhoneNumber';
export { default as parsePhoneNumber } from './parsePhoneNumber';

// Exports the data mappers for utils
export { PHONE_FORMATTER_MAPPER as COUNTRY_CODE_PHONE_FORMATTER_MAP } from './data/phoneFormatterMapper';
export { DIAL_CODE_MAPPER as COUNTRY_CODE_DIAL_CODE_MAP } from './data/dialCodeMapper';
export { PHONE_REGEX_MAPPER as COUNTRY_CODE_PHONE_REGEX_MAP } from './data/phoneRegexMapper';
