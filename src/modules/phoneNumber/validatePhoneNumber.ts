import { PHONE_REGEX_MAPPER } from "./data/phoneRegexMapper";

const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: string
): boolean => {
  if (!countryCode) throw new Error("Parameter `countryCode` is invalid!");
  if (!phoneNumber) throw new Error("Parameter `phoneNumber` is invalid!");

  if (PHONE_REGEX_MAPPER.hasOwnProperty(countryCode)) {
    const regex = PHONE_REGEX_MAPPER[countryCode];
    return regex.test(phoneNumber);
  }

  // Return false if the country code is not supported
  return false;
};

export default validatePhoneNumber;
