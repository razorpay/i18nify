import { phoneFormatterMapper } from "./data/phoneFormatterMapper";

const formatPhoneNumber = (
  phone_number: string,
  country_code: string
): string | null => {
  const pattern = phoneFormatterMapper[country_code];

  if (!pattern) return null;

  let charCountInFormatterPattern = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "x") {
      charCountInFormatterPattern++;
    }
  }

  const diff = phone_number.length - charCountInFormatterPattern;
  const phoneNumberWithoutPrefix = phone_number.slice(diff);
  const formattedNumber: string[] = [];
  let numberIndex = 0;

  for (let i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    if (patternChar === "x") {
      if (numberIndex < phoneNumberWithoutPrefix.length) {
        formattedNumber.push(phoneNumberWithoutPrefix[numberIndex]);
        numberIndex++;
      }
    } else {
      formattedNumber.push(patternChar);
    }
  }

  const formattedPhoneNumberWithoutPrefix = formattedNumber.join("");
  const formattedPhoneNumberWithPrefix =
    phone_number.slice(0, diff) + " " + formattedPhoneNumberWithoutPrefix;

  return formattedPhoneNumberWithPrefix.trim();
};

export default formatPhoneNumber;
