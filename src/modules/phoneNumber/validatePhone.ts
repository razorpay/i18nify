const COUNTRY_PHONE_REGEX = {
  IN: /^[789]\d{9}$/,
};

export default function (
  phone: string,
  country: keyof typeof COUNTRY_PHONE_REGEX
) {
  const regex = COUNTRY_PHONE_REGEX[country];

  return regex.test(phone);
}
