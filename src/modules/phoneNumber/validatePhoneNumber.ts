import { PHONE_REGEX_MAPPER } from "./data/phoneRegexMapper";
import { PHONE_FORMATTER_MAPPER } from "./data/phoneFormatterMapper";

const validatePhoneNumber = (
  phoneNumber: string | number,
  countryCode: keyof typeof PHONE_FORMATTER_MAPPER,
): boolean => {
  if (!countryCode) throw new Error("Parameter `countryCode` is invalid!");
  if (!phoneNumber) throw new Error("Parameter `phoneNumber` is invalid!");

  if (PHONE_REGEX_MAPPER.hasOwnProperty(countryCode)) {
    const regex = PHONE_REGEX_MAPPER[countryCode];
    return regex.test(phoneNumber as string);
  }

  // Return false if the country code is not supported
  return false;
};

export default validatePhoneNumber;
