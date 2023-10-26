import { phoneRegexMapper } from "./data/phoneRegexMapper";

const validatePhoneNumber = (
  phone_number: string,
  country_code: string
): boolean => {
  if (phoneRegexMapper.hasOwnProperty(country_code)) {
    const regex = phoneRegexMapper[country_code];
    return regex.test(phone_number);
  }

  // Return false if the country code is not supported
  return false;
};

export default validatePhoneNumber;
