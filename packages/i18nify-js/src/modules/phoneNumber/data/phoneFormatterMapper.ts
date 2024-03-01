import { CountryCodeType } from '../../types/geo';

export const PHONE_FORMATTER_MAPPER: { [key in CountryCodeType]: string } = {
  IN: 'xxxx xxxxxx', // India, Example: 7394926646 formatted to 7394 926646
  MY: 'xx xxxxx xx', // Malaysia, Example: 0123456789 formatted to 01 23456 789
  AE: 'xx xxx xxxx', // United Arab Emirates, Example: 501234567 formatted to 50 123 4567
  AL: 'xxx xx xxxx', // Albania, Example: 422012345 formatted to 422 01 2345
  AM: 'xx xx xx xx', // Armenia, Example: 77123456 formatted to 77 12 34 56
  AR: 'xxxx-xxxx', // Argentina, Example: 11123456 formatted to 1112-3456
  AU: 'xxx xxx xxx', // Australia, Example: 412345678 formatted to 412 345 678
  AW: 'xxx-xxxx', // Aruba, Example: 2971234 formatted to 297-1234
  BB: 'xxx-xxxx', // Barbados, Example: 2461234 formatted to 246-1234
  BD: 'xxxx-xxxxxx', // Bangladesh, Example: 0212345678 formatted to 0212-345678
  BM: 'xxx-xxxx', // Bermuda, Example: 4411234 formatted to 441-1234
  BN: 'xxxx-xxxx', // Brunei, Example: 22345678 formatted to 2234-5678
  BO: 'xxxx-xxxx', // Bolivia, Example: 41234567 formatted to 4123-4567
  BS: 'xxx-xxxx', // Bahamas, Example: 2421234 formatted to 242-1234
  BW: 'xx xxxx xxxx', // Botswana, Example: 71123456 formatted to 71 1234 5678
  BZ: 'xxx-xxxx', // Belize, Example: 5011234 formatted to 501-1234
  CA: 'xxx-xxx-xxxx', // Canada, Example: 4161234567 formatted to 416-123-4567
  CH: 'xxx xxx xxx', // Switzerland, Example: 212345678 formatted to 212 345 678
  CN: 'xxxx-xxxxxxx', // China, Example: 10123456789 formatted to 1012-3456789
  CO: 'xxxx-xxxxxxx', // Colombia, Example: 3012345678 formatted to 3012-345678
  CR: 'xxxx-xxxx', // Costa Rica, Example: 22123456 formatted to 2212-3456
  CU: 'xxxx-xxxx', // Cuba, Example: 71234567 formatted to 7123-4567
  CZ: 'xxx xxx xxx', // Czech Republic, Example: 212345678 formatted to 212 345 678
  DK: 'xx xx xx xx', // Denmark, Example: 12345678 formatted to 12 34 56 78
  DO: 'xxx-xxxxxxx', // Dominican Republic, Example: 8091234567 formatted to 809-1234567
  DZ: 'xxxx-xxxx-xxx', // Algeria, Example: 1234567890 formatted to 1234-5678-90
  EG: 'xx xxx xxxx', // Egypt, Example: 101234567 formatted to 10 1234 567
  ET: 'xx xxx xxxx', // Ethiopia, Example: 111234567 formatted to 11 1234 567
  FJ: 'xxxx xxxx', // Fiji, Example: 32123456 formatted to 3212 3456
  GB: 'xxxx xxx xxx', // United Kingdom, Example: 07123456789 formatted to 0712 345 6789
  GH: 'xxx xxx xxxx', // Ghana, Example: 301234567 formatted to 301 234 5678
  GI: 'xxxx xxxx', // Gibraltar, Example: 57123456 formatted to 5712 3456
  GM: 'xxxx-xxxx', // Gambia, Example: 4371234 formatted to 4371-234
  GT: 'xxxx-xxxx', // Guatemala, Example: 21234567 formatted to 2123-4567
  GY: 'xxx-xxxx', // Guyana, Example: 123-4567
  HK: 'xxxx xxxx', // Hong Kong, Example: 2123 4567
  HN: 'xxxx-xxxx', // Honduras, Example: 2123-4567
  HR: 'xxx xxx xxxx', // Croatia, Example: 091 234 5678
  HT: 'xxx-xxxx', // Haiti, Example: 345-6789
  HU: 'xxx xxx xxxx', // Hungary, Example: 061 234 5678
  ID: 'xxxx-xxxx-xxxx', // Indonesia, Example: 0312-3456-7890
  IL: 'xxxx-xxx-xxx', // Israel, Example: 0507-123-456
  JM: 'xxx-xxxx', // Jamaica, Example: 876-1234
  KE: 'xxx xxxxxx', // Kenya, Example: 0712 345678
  KG: 'xxx-xx-xx-xx', // Kyrgyzstan, Example: 0312-45-67-89
  KH: 'xxx-xxx-xxx', // Cambodia, Example: 012-345-678
  KY: 'xxx-xxxx', // Cayman Islands, Example: 345-1234
  KZ: 'xxx-xxx-xx-xx', // Kazakhstan, Example: 0712-345-67-89
  LA: 'xxx xx xxxx', // Laos, Example: 020 55 12345
  LK: 'xx xxx xxxx', // Sri Lanka, Example: 011 234 5678
  LR: 'xxx-xxx-xxxx', // Liberia, Example: 077-123-4567
  LS: 'xxx xx xxxx', // Lesotho, Example: 221 12 3456
  LT: 'xxx xxxxx', // Lithuania, Example: 612 34567
  LU: 'xxx xx xxx', // Luxembourg, Example: 691 23 456
  LV: 'xxxx xxxx', // Latvia, Example: 2021 2345
  MA: 'xxxx-xxxxxx', // Morocco, Example: 0520-123456
  MD: 'xx xxxxxx', // Moldova, Example: 022 123456
  ME: 'xx xxxxxx', // Montenegro, Example: 020 123456
  MG: 'xx xx xx xx xx', // Madagascar, Example: 020 12 34 56 78
  MK: 'xx xx xx xx', // North Macedonia, Example: 02 1234 5678
  MM: 'xx xxxxxx', // Myanmar, Example: 01 234567
  MN: 'xxx-xx-xxxx', // Mongolia, Example: 701-12-3456
  MO: 'xxxx xxxx', // Macau, Example: 2831 2345
  MU: 'xx xxxx xxxx', // Mauritius, Example: 02 1234 5678
  MV: 'xxxxxx', // Maldives, Example: 771234
  MW: 'xx xxxx xxxx', // Malawi, Example: 01 2345 6789
  MX: 'xxx-xxx-xxxx', // Mexico, Example: 555-123-4567
  MZ: 'xx xxxxxxx', // Mozambique, Example: 82 1234567
  NA: 'xx xxxx xxxx', // Namibia, Example: 61 2345 6789
  NG: 'xxx xxx xxxx', // Nigeria, Example: 080 123 45678
  NI: 'xxxx-xxxx', // Nicaragua, Example: 2123-4567
  NL: 'xxx-xxxxxxx', // Netherlands, Example: 020-1234567
  NO: 'xxxx xxxx', // Norway, Example: 1234 5678
  NP: 'xxxx-xxxxxxx', // Nepal, Example: 0123-4567890
  NZ: 'xxx-xxxxxxx', // New Zealand, Example: 021-1234567
  OM: 'xxxx-xxxx', // Oman, Example: 2345-6789
  PA: 'xxx-xxxx', // Panama, Example: 212-3456
  PE: 'xxx-xxx-xxx', // Peru, Example: 012-345-678
  PG: 'xxx-xxxxxx', // Papua New Guinea, Example: 675-123456
  PH: 'xxx-xxxx', // Philippines, Example: 091-2345
  PK: 'xxx-xxxxxxx', // Pakistan, Example: 021-1234567
  PL: 'xxx xxx xxx', // Poland, Example: 022 123 456
  PR: 'xxx-xxx-xxxx', // Puerto Rico, Example: 787-123-4567
  PS: 'xxxx-xxxxxxx', // Palestine, Example: 0223-4567890
  PT: 'xxx xxx xxx', // Portugal, Example: 021 123 456
  PY: 'xxx-xxxxxx', // Paraguay, Example: 021-234567
  QA: 'xxxx xxxx', // Qatar, Example: 3345 6789
  RO: 'xxx xxx xxxx', // Romania, Example: 021 234 5678
  RS: 'xxx xxxxx', // Serbia, Example: 011 12345
  RU: 'xxx xxx-xx-xx', // Russia, Example: 495 123-45-67
  RW: 'xxx xxxxxx', // Rwanda, Example: 025 123456
  SA: 'xxx-xxxxxxx', // Saudi Arabia, Example: 011-1234567
  SC: 'xx xxxxx', // Seychelles, Example: 2 510123
  SE: 'xxx-xxx xx xx', // Sweden, Example: 08-123 45 67
  SG: 'xxxx xxxx', // Singapore, Example: 6123 4567
  SI: 'xx xxxxxx', // Slovenia, Example: 01 234567
  SK: 'xxx xxx xxx', // Slovakia, Example: 02 123 456
  SL: 'xxx-xxxxxx', // Sierra Leone, Example: 022-123456
  SM: 'xxxxx xxxxx', // San Marino, Example: 0549 12345
  SN: 'xx xxx xx xx', // Senegal, Example: 33 123 45 67
  SO: 'xxx xxxxxxx', // Somalia, Example: 01 2345678
  SR: 'xxx-xxxx', // Suriname, Example: 212-3456
  SS: 'xxx xxxx xxx', // South Sudan, Example: 0977 123 456
  SV: 'xxxx-xxxx', // El Salvador, Example: 2312-3456
  SZ: 'xxx xx xxxx', // Eswatini (Swaziland), Example: 250 12 3456
  TG: 'xx xx xx xx', // Togo, Example: 90 12 34 56
  TH: 'xxx-xxxxxxx', // Thailand, Example: 021-2345678
  TJ: 'xxx xx xx xx', // Tajikistan, Example: 372 12 34 56
  TL: 'xxx-xxxxxxx', // Timor-Leste, Example: 211-234567
  TN: 'xx xxxxxx', // Tunisia, Example: 71 234567
  TR: 'xxx xxx xx xx', // Turkey, Example: 312 234 56 78
  TT: 'xxx-xxxx', // Trinidad and Tobago, Example: 868-1234
  TW: 'xxxx-xxxxxx', // Taiwan, Example: 0212-345678
  TZ: 'xxx xxx xxxx', // Tanzania, Example: 022 123 4567
  UA: 'xx xxx xx xx', // Ukraine, Example: 44 123 45 67
  UG: 'xxx xxxxxxx', // Uganda, Example: 031 2345678
  US: 'xxx-xxx-xxxx', // United States, Example: 212-555-1234
  UY: 'xxx-xxxxx', // Uruguay, Example: 212-34567
  UZ: 'xxx-xxx-xx-xx', // Uzbekistan, Example: 371 234-56-78
  VC: 'xxx-xxxx', // Saint Vincent and the Grenadines, Example: 784-1234
  VE: 'xxxx-xxx-xxxx', // Venezuela, Example: 2124-123-4567
  VN: 'xxxx-xxxxxxx', // Vietnam, Example: 0240-1234567
  YE: 'xxxx-xxxx', // Yemen, Example: 0123-4567
  ZA: 'xxx-xxx-xxxx', // South Africa, Example: 011-234-5678
  ZM: 'xxx-xxxxxxx', // Zambia, Example: 0211-2345678
  ZW: 'xx xxx xxxx', // Zimbabwe, Example: 04 123 4567
  KW: 'xxx xx xxxx', // Kuwait, Example: 223 45 6789
  BH: 'xxxx xxxx', // Bahrain, Example: 1700 1234
  AG: 'xxx-xxxx', // Antigua and Barbuda, Example: 268-1234
  AI: 'xxx-xxxx', // Anguilla, Example: 264-4970
  AS: 'xxx-xxxx', // American Samoa, Example: 684-1234
  DM: 'xxx-xxxx', // Dominica, Example: 767-1234
  GD: 'xxx-xxxx', // Grenada, Example: 473-1234
  GU: 'xxx-xxxx', // Guam, Example: 671-1234
  KN: 'xxx-xxxx', // Saint Kitts and Nevis, Example: 869-1234
  LC: 'xxx-xxxx', // Saint Lucia, Example: 758-1234
  MP: 'xxx-xxxx', // Northern Mariana Islands, Example: 670-1234
  MS: 'xxx-xxxx', // Montserrat, Example: 664-1234
  TC: 'xxx-xxxx', // Turks and Caicos Islands, Example: 649-1234
  VG: 'xxx-xxxx', // British Virgin Islands, Example: 284-1234
  VI: 'xxx-xxxx', // U.S. Virgin Islands, Example: 340-1234
  GR: 'xx xxx xxxx', // Greece, Example: 21 2345 6789
  BE: 'xxx xx xx xx', // Belgium, Example: 012 34 56 78
  FR: 'xx xx xx xx xx', // France, Example: 01 23 45 67 89
  ES: 'xxx xxx xxx', // Spain, Example: 612 345 678
  IT: 'xxx xxxx xxxx', // Italy, Example: 312 3456 7890
  VA: 'xxx xxxx xxxx', // Vatican City, Example: 066 9887 7654
  AT: 'xxx xxxxxxxx', // Austria, Example: 012 34567890
  DE: 'xxx xxxxxxxx', // Germany, Example: 030 12345678
  BR: 'xx xxxx-xxxx', // Brazil, Example: 11 2345-6789
  CL: 'x xxxx xxxx', // Chile, Example: 2 2345 6789
  JP: 'xx xxxx xxxx', // Japan, Example: 90 1234 5678
  KR: 'xx xxxx xxxx', // South Korea, Example: 10 1234 5678
  AF: 'xx xxx xxxx', // Afghanistan, Example: 20 123 4567
  IR: 'xx xxxx xxxx', // Iran, Example: 21 2345 6789
  LY: 'xx xxxxx xxxx', // Libya, Example: 21 12345 6789
  MR: 'xx xx xx xx', // Mauritania, Example: 22 12 34 56
  ML: 'xx xx xx xx', // Mali, Example: 20 12 34 56
  GN: 'xx xx xx xx', // Guinea, Example: 30 12 34 56
  CI: 'xx xx xx xx', // Ivory Coast, Example: 21 12 34 56
  BF: 'xx xx xx xx', // Burkina Faso, Example: 20 12 34 56
  NE: 'xx xx xx xx', // Niger, Example: 20 12 34 56
  BJ: 'xx xx xx xx', // Benin, Example: 21 12 34 56
  TD: 'xx xx xx xx', // Chad, Example: 22 12 34 56
  CF: 'xx xx xx xx', // Central African Republic, Example: 21 12 34 56
  CM: 'xx xx xx xx', // Cameroon, Example: 22 12 34 56
  CV: 'xxx xxxx', // Cape Verde, Example: 231 1234
  ST: 'xx xxx xx', // Sao Tome and Principe, Example: 22 123 45
  GQ: 'xx xxx xxxx', // Equatorial Guinea, Example: 22 123 4567
  GA: 'xx xx xx xx', // Gabon, Example: 01 12 34 56
  CG: 'xx xx xx xx', // Republic of the Congo, Example: 22 12 34 56
  CD: 'xx xxx xxxx', // Democratic Republic of the Congo, Example: 99 123 4567
  AO: 'xx xxx xxxx', // Angola, Example: 22 123 4567
  GW: 'xx xx xx xx', // Guinea-Bissau, Example: 20 12 34 56
  SD: 'xx xxx xxxx', // Sudan, Example: 15 123 4567
  DJ: 'xx xx xx xx', // Djibouti, Example: 21 12 34 56
  BI: 'xx xx xx xx', // Burundi, Example: 22 12 34 56
  RE: 'xxx xx xx xx', // Réunion, Example: 262 12 34 56
  YT: 'xxx xx xx xx', // Mayotte, Example: 269 12 34 56
  KM: 'xx xx xx xx', // Comoros, Example: 76 12 34 56
  SH: 'xxxx', // Saint Helena, Example: 5123
  ER: 'x xxx xxxx', // Eritrea, Example: 7 123 4567
  FO: 'xxx xxx', // Faroe Islands, Example: 298 123
  GL: 'xx xx xx', // Greenland, Example: 32 12 34
  IE: 'xx xxx xxxx', // Ireland, Example: 01 234 5678
  IS: 'xxx xxxx', // Iceland, Example: 421 1234
  MT: 'xx xx xx xx', // Malta, Example: 21 12 34 56
  CY: 'xx xxxxxx', // Cyprus, Example: 22 123456
  FI: 'xx xxx xxxx', // Finland, Example: 09 123 4567
  AD: 'xxx xxx', // Andorra, Example: 376 123
  MC: 'xx xx xx xx', // Monaco, Example: 99 12 34 56
  XK: 'xx xxx xxxx', // Kosovo, Example: 38 012 3456
  LI: 'xxx xx xx', // Liechtenstein, Example: 423 12 34
  MF: 'xxx xx xx xx', // Saint Martin (French part), Example: 590 12 34 56
  GF: 'xxx xx xx xx', // French Guiana, Example: 594 12 34 56
  NR: 'xxx xxxx', // Nauru, Example: 555 1234
  TO: 'xxxxx', // Tonga, Example: 12345
  SB: 'xxxxx', // Solomon Islands, Example: 12345
  VU: 'xx xxxxx', // Vanuatu, Example: 30 12345
  PW: 'xxx xxxx', // Palau, Example: 680 1234
  CK: 'xx xxx', // Cook Islands, Example: 20 123
  NU: 'xxxx', // Niue, Example: 1234
  WS: 'xx xxxxx', // Samoa, Example: 61 23456
  KI: 'xx xxx', // Kiribati, Example: 31 123
  NC: 'xx xx xx', // New Caledonia, Example: 20 12 34
  TV: 'xxxxx', // Tuvalu, Example: 12345
  PF: 'xx xx xx xx', // French Polynesia, Example: 40 12 34 56
  FM: 'xxx xxxx', // Micronesia, Example: 320 1234
  MH: 'xxx xxxx', // Marshall Islands, Example: 247 1234
  KP: 'xx xxx xxxx', // North Korea, Example: 02 123 4567
  LB: 'xx xxx xxx', // Lebanon, Example: 01 234 567
  JO: 'xx xxxx xxxx', // Jordan, Example: 06 1234 5678
  SY: 'xx xxxx xxxx', // Syria, Example: 11 1234 5678
  IQ: 'xx xxx xxxx', // Iraq, Example: 01 234 5678
  BT: 'xx xxxxxx', // Bhutan, Example: 02 345678
  TM: 'xx xxxxxx', // Turkmenistan, Example: 12 345678
  AZ: 'xx xxx xx xx', // Azerbaijan, Example: 12 345 67 89
  GE: 'xxx xxx xxx', // Georgia, Example: 032 123 456
  BG: 'xx xxx xxxx', // Bulgaria, Example: 02 123 4567
  EE: 'xxx xxxx', // Estonia, Example: 321 1234
  BY: 'xx xxx-xx-xx', // Belarus, Example: 17 123-45-67
  BA: 'xx xxx-xxxx', // Bosnia and Herzegovina, Example: 33 123-4567
  FK: 'xxxxx', // Falkland Islands, Example: 12345
  EC: 'xx xxx xxxx', // Ecuador, Example: 02 123 4567
  CW: 'xxx xxxx', // Curaçao, Example: 999 1234
  BQ: 'xxx xxxx', // Bonaire, Sint Eustatius, and Saba, Example: 717 1234
  FW: 'xxx xx xx xx', // French West Indies, Example: 690 12 34 56
};
