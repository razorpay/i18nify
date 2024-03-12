import { CountryCodeType } from '../../types';

export const PHONE_REGEX_MAPPER: { [key in CountryCodeType]: RegExp } = {
  // India, mobile numbers starting with 6, 7, 8, or 9 and followed by 9 digits
  IN: /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/,
  // Malaysia, numbers with optional country code +60, followed by 1-3 digits area code and 7-8 digits
  MY: /^(\+?6?0)?(\d{1,3})[-. ]?(\d{7,8})$/,
  // United Arab Emirates, numbers starting with 2, 3, 4, 6, 7, or 9 followed by 8 digits, with optional country code +971
  AE: /^(?:\+?971|0)?(?:2|3|4|6|7|9)\d{8}$/,
  // Albania, numbers starting with 4-9 followed by 7 digits or starting with 6 followed by 8 digits, with optional country code +355
  AL: /^(?:\+?355)?(?:[4-9]\d{7}|6\d{8})$/,
  // Armenia, 8 digits for landlines or 6 digits followed by 2 additional digits for mobile, with optional country code +374
  AM: /^(?:\+?374)?(?:[0-9]{8}|[0-9]{6}[0-9]{2})$/,
  // Argentina, numbers with area codes starting with 11, 2, 3, 6, or 8 followed by 8 digits, with optional country code +54
  AR: /^(?:(?:\+|0{0,2})54)?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/,
  // Australia, mobile numbers starting with 04 followed by 8 digits, with optional country code +61
  AU: /^(?:\+?61|0)4\d{8}$/,
  // Aruba, 7 digits not starting with 0, with optional country code +297
  AW: /^(?:(?:\+297)?(?!0)\d{7})$/,
  // Barbados, optional country code +1 followed by 246 and 7 digits
  BB: /^(?:(?:\+1)?246)?(?:\d{3})?\d{7}$/,
  // Bangladesh, mobile numbers starting with 1 followed by a digit from 1-9 (except 2) and then 8 digits, with optional country code +880
  BD: /^(?:\+?880|0)1[13456789]\d{8}$/,
  // Bermuda, optional country code +1 followed by 441 and 7 digits
  BM: /^(?:(?:\+1)?441)?(?:\d{2})?\d{7}$/,
  // Brunei, optional country code +673 followed by 3 digits and then 4 digits
  BN: /^(?:\+?673)?(?:\d{3})?\d{4}$/,
  // Bolivia, numbers with area codes starting with 2, 3, 6, or 7 followed by 7 digits, with optional country code +591
  BO: /^(?:(?:\+|0{0,2})591)?(?:(?:2|3|7|6)\d{7})$/,
  // Bahamas, optional country code +1 followed by 242 and 7 digits
  BS: /^(?:(?:\+1)?242)?(?:\d{3})?\d{7}$/,
  // Botswana, mobile numbers starting with 74 followed by 7 digits, with optional country code +267
  BW: /^(?:(?:\+267)?\s?)?[74]\d{7}$/,
  // Belize, mobile numbers starting with 6, 2, or 2 followed by 4 digits, with optional country code +501
  BZ: /^(?:(?:\+501)?\s?)?[622]\d{4}$/,
  // Switzerland, numbers with optional country code +41, possibly starting with 0, followed by 2 digits and groups of 2-3 digits
  CH: /^(?:(?:\+41|0)(?:\s*\(?0\)?\s*))?(?:\d{2}\s*)?\d{3}\s*\d{2}\s*\d{2}$/,
  // China, mobile numbers starting with 1 followed by 10 digits, with optional international dialing code +86
  CN: /^(?:(?:\+|00)86)?1\d{10}$/,
  // Colombia, numbers with area codes starting with 1-8 followed by 6-7 digits, with optional country code +57
  CO: /^(?:(?:\+57|0057)?)?[1-8]{1}\d{6,7}$/,
  // Oman, mobile numbers starting with 95, 96, 97, or 98 followed by 6 digits, with optional country code +968
  OM: /^(?:\+?968)?(?:95|96|97|98)\d{6}$/,
  // Costa Rica, 8 digits starting with 1-9, with optional country code +506
  CR: /^(?:(?:\+506)?\s*|0)?[1-9]\d{7}$/,
  // Cuba, numbers starting with 5-8 followed by 7 digits, with optional country code +53
  CU: /^(?:\+?53)?(?:[5-8]\d{7})$/,
  // Czech Republic, 9 digits, with optional country code +420
  CZ: /^(?:\+?420)?(?:\d{9})$/,
  // Denmark, 8 digits, with optional country code +45
  DK: /^(?:\+?45)?(?:\d{8})$/,
  // Dominican Republic, numbers starting with 809 or toll-free prefixes 800, 888, 889 followed by 7 digits
  DO: /^(?:(?:\+1)?809|1-8(?:00|88|89))(?:\d{7})$/,
  // Algeria, numbers starting with 5, 6, or 7 followed by 8 digits, with optional country code +213
  DZ: /^(?:\+?213|0)([567]\d{8})$/,
  // Egypt, 10 digits with optional country code +20
  EG: /^(?:(?:\+20|20)?(\d{10}))$/,
  // Ethiopia, numbers starting with 1-5 or 9 followed by 8 digits, with optional country code +251
  ET: /^(?:\+?251)?[1-59]\d{8}$/,
  // Fiji, 3 digits followed by 4 digits with optional country code +679
  FJ: /^(?:(?:\+?679)?\s?\d{3}\s?\d{4})?$/,
  // United Kingdom, mobile numbers starting with 7 followed by 9 digits, with optional country code +44
  GB: /^(?:(?:\+44\s?|0)7\d{3}(\s?\d{4,})?)$/,
  // Ghana, 9 digits with optional country code +233
  GH: /^(?:(?:\+233)|0)?(?:\d{9})$/,
  // Gibraltar, 5 digits with optional country code +350
  GI: /^(?:\+350)?\d{5}$/,
  // Gambia, 5 to 7 digits with optional country code +220
  GM: /^(?:\+220)?\d{5,7}$/,
  // Guatemala, numbers starting with 2, 4, 6, or 8 followed by 7 or 8 digits, with optional country code +502
  GT: /^(?:\+502)?[2468]\d{7,8}$/,
  // Guyana, numbers starting with 2-9 followed by 7 digits, with optional country code +592
  GY: /^(?:(?:\+592)?(?:(?:\s)?[2-9])(?:(?:\s)?\d))?(?:(?:\s)?\d{4})$/,
  // Hong Kong, numbers starting with 4, 5, 6, 7, 8, or 9 followed by 7 digits, with optional country code +852
  HK: /^(?:\+852\s?)?[456789]\d{3}\s?\d{4}$/,
  // Honduras, numbers starting with 8 or 9 followed by 7 digits, with optional country code +504
  HN: /^(?:\+504)?[89]\d{7}$/,
  // Croatia, 8 or 9 digits with optional country code +385
  HR: /^(?:\+?385)?\d{8,9}$/,
  // Haiti, 8 digits with optional country code +509
  HT: /^(?:\+?509)?\d{8}$/,
  // Hungary, 2 digits followed by 3 digits and then 4 digits, with optional country code +36
  HU: /^(?:(?:\+36))(\s?\d{2}\s?\d{3}\s?\d{4})$/,
  // Indonesia, 2 to 4 digits area code followed by 3 to 4 digits and then 3 to 4 digits, with optional country code +62
  ID: /^(?:\+?62|0[1-9])[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}$/,
  // Israel, numbers starting with 2, 3, 4, 8, or 9 followed by 7 digits, with optional country code +972
  IL: /^(?:(?:\+972|0)(?:-)?)[23489]\d{7}$/,
  // Jamaica, 7 to 10 digits with optional country code +1876
  JM: /^(?:(?:\+1876))\d{7,10}$/,
  // Kenya, 6 or 7 digits with optional country code +254
  KE: /^(?:(?:\+254)|(?:0))(?:\d{6,7})$/,
  // Kyrgyzstan, 9 digits with optional country code +996
  KG: /^(?:\+996)?\s?\d{9}$/,
  // Cambodia, 7 or 8 digits starting with 1-9 with optional country code +855
  KH: /^(?:(?:\+855)|(?:0))(?:\s?[1-9]\d{7,8})$/,
  // Cayman Islands, 6 digits with mandatory country code +1 345
  KY: /^(?:\+?1\s?(345))\d{6}$/,
  // Kazakhstan, 9 digits following the digit 7, with optional prefixes +7 or 8
  KZ: /^(?:\+?7|8)?7\d{9}$/,
  // Laos, numbers starting with 20 followed by 7 to 9 digits, with optional country code +856
  LA: /^(?:(?:\+?856)|0)(20\d{7,9})$/,
  // Sri Lanka, 9 digits with optional country code +94
  LK: /^(?:(?:\+94)|0)(?:\d{9})$/,
  // Liberia, 4 digits followed by another 4 digits, with mandatory country code +231
  LR: /^(?:\+231)[ -\d]{4}[ -\d]{4}$/,
  // Lesotho, numbers starting with 5 or 6 followed by 7 digits, with optional country code +266
  LS: /^(?:(?:\+?266)|0)?[56]\d{7}$/,
  // Morocco, 9 digits with optional country code +212 or starting with 0
  MA: /^(?:(?:\+?212(\s*[-|\s*]?\d{1,9})?)|(?:0))(?:\d{9})$/,
  // Moldova, 7 or 8 digits with optional country code +373
  MD: /^(?:(?:\+373)|(?:0))(?:\d{7,8})$/,
  // North Macedonia, numbers with optional area code starting with 2 followed by 6 digits, with optional country code +389
  MK: /^(?:\+389|0)(?:(?:2[0-4]|[3-9])\s?)?\d{6}$/,
  // Myanmar, 10 digits starting with 1-9, with optional country code +95
  MM: /^(?:(?:\+?95)|0)?[1-9]\d{9}$/,
  // Mongolia, 8 digits with optional country code +976
  MN: /^(?:\+976|0)\d{8}$/,
  // Macao, 8 digits with optional country code +853
  MO: /^(?:(?:\+?853)|[0-9])?\d{8}$/,
  // Mauritius, 8 digits with optional country code +230
  MU: /^(?:\+230|0)?\d{8}$/,
  // Maldives, 7 digits with optional country code +960
  MV: /^(?:(?:\+?960)|0)?\d{7}$/,
  // Malawi, numbers starting with 1-9 followed by 6 digits, with mandatory country code +265
  MW: /^(?:\+265)[1-9]\d{6}$/,
  // Mexico, numbers may start with 1 or 01 for long distance, followed by 3 digits area code and 7 digits, with optional country code +52
  MX: /^(?:(?:\+?52)?\s?(?:1|01)?\s?)?(?:\d{3}\s?\d{3}\s?\d{4})$/,
  // Namibia, 8 digits with optional country code +264
  NA: /^(?:(?:\+264)|0)?\d{8}$/,
  // Nigeria, 7 or 8 digits with optional country code +234
  NG: /^(?:(?:\+234)|(?:0))(?:\d{7,8})$/,
  // Nicaragua, 8 digits with optional country code +505
  NI: /^(?:(?:\+505))?(?:\d{8})$/,
  // Norway, numbers may have 2 or 3 digits area code followed by 5 digits, with optional country code +47
  NO: /^(?:(?:\+?47)|\d{2}|\d{3})\s?\d{2}\s?\d{3}$/,
  // Nepal, 9 or 10 digits with optional country code +977
  NP: /^(?:(?:\+977))?(\d{9,10})$/,
  // New Zealand, numbers may have 2 to 5 digits area code followed by 4 to 8 digits, with optional country code +64
  NZ: /^(?:\+?64|0)(\d{2,5} \d{4,8}|\d{3,4} \d{4})$/,
  // Peru, mobile numbers starting with 9 followed by 8 digits, with optional country code +51
  PE: /^(?:(?:\+51)|0)?(?:9\d{8})$/,
  // Papua New Guinea, numbers starting with 7, 8, or 9 followed by 7 digits, with optional country code +675
  PG: /^(?:\+?675)?(?:[7-9]\d{7})$/,
  // Philippines, 10 digits with optional country code +63
  PH: /^(?:(?:\+?63)|0)(?:\d{10})$/,
  // Pakistan, numbers starting with 3, 4, or 5 followed by 9 digits, with optional country code +92
  PK: /^(?:(?:\+92)|0)?[345]\d{9}$/,
  // Qatar, numbers starting with 33 followed by 5 digits, with optional country code +974
  QA: /^(?:\+?974)?-?33\d{5}$/,
  // Russia, 10 digits starting with 9, with optional country code +7 or 8
  RU: /^(?:\+?7|8)?[ -]?\(?9\d{2}\)?[ -]?\d{3}[ -]?\d{2}[ -]?\d{2}$/,
  // Saudi Arabia, numbers starting with 1 followed by 8 digits or starting with 4 or 5 followed by 2 or 3 digits and then 4 digits, with optional country code +966
  SA: /^(?:\+?966)?\s?1?[\s-]?(?:[45]\d{2}|5\d{3})[\s-]?\d{4}$/,
  // Seychelles, 5 digits following the area code 248 or 4 digits, with optional country code +248
  SC: /^(?:(?:\+248)|\d{4})\d{5}$/,
  // Sweden, numbers starting with 1-5, 7-9 followed by 9 digits, with optional country code +46
  SE: /^(?:\+?46|0)\s?[1-57-9](?:[0-9]\s?){8}$/,
  // Singapore, 8 digits with optional country code +65
  SG: /^(?:(?:\+65)|(?:\(\+65\))|(?:65))\d{4}\d{4}$/,
  // Sierra Leone, 9 digits with optional country code +232
  SL: /^(?:(?:\+232)|(?:0))?\d{9}$/,
  // Somalia, numbers starting with 5, 6, or 7 followed by 7 digits, with optional country code +252
  SO: /^(?:\+252|0)?[567]\d{7}$/,
  // South Sudan, numbers starting with 1-9 followed by 7 to 9 digits, with optional country code +211
  SS: /^(?:\+211|0)?[1-9]\d{7,9}$/,
  // El Salvador, 8 digits with optional country code +503
  SV: /^(?:(?:\+?503)|(?:0))(?:\d{8})$/,
  // Eswatini (Swaziland), 7 or 8 digits with optional country code +268
  SZ: /^(?:\+?268)?\d{7,8}$/,
  // Thailand, 9 digits with optional country code +66
  TH: /^(?:(?:\+66)|0)\d{9}$/,
  // Trinidad and Tobago, 7 digits with mandatory country code +1-868
  TT: /^(?:(?:\+?1-868)|\(?868\)?)(\d{7})$/,
  // Tanzania, numbers starting with 6 or 7 followed by 8 digits, with optional country code +255
  TZ: /^(?:(?:\+?255)|0)?[67]\d{8}$/,
  // United States and Canada, 10 digits with optional country code +1
  US: /^(\+\d{1,2}\s?)?([2-9]{1}\d{2}[2-9]{1}\d{6})$/,
  CA: /^(\+\d{1,2}\s?)?([2-9]{1}\d{2}[2-9]{1}\d{6})$/,
  // Uruguay, numbers starting with 9 for mobiles, 2 for landlines in Montevideo, or other digits for landlines outside Montevideo, followed by 3 or 6 digits, with optional country code +598
  UY: /^(?:(?:\+598|0)\s?(9\d{3}|2\d{2}|[4-9]\d{6}))$/,
  // Uzbekistan, numbers starting with 3, 4, 5, 6, 7, 8, or 9 followed by 8 digits, with optional country code +998
  UZ: /^(?:\+?998)?\s?[3456789]\d{8}$/,
  // Yemen, 7 or 8 digits with optional country code +967
  YE: /^(?:\+?967)?(?:\d{7,8})$/,
  // South Africa, 9 digits with optional country code +27
  ZA: /^(?:(?:\+27)|0)(\d{9})$/,
  // Kuwait, numbers starting with 5, 6, or 9 followed by 7 digits, with mandatory country code +965
  KW: /^(?:\+?965)[569]\d{7}$/,
  // Bahrain, numbers starting with 3, 5, or 6 followed by 7 digits, with optional country code +973
  BH: /^(?:\+?973)?[356]\d{7}$/,
  // East Timor (Timor-Leste), 3 digits followed by 3 or 4 digits with optional country code +670
  TL: /^(?:(?:\+670)\s?)?[0-9]{3}\s?[0-9]{3,4}$/,
  // Saint Vincent and the Grenadines, 7 digits with optional country code +1 784
  VC: /^(?:(?:\+1)?784)?(?:\d{3})?\d{7}$/,
  // Venezuela, numbers starting with 4 followed by 9 digits, with optional country code +58
  VE: /^(?:(?:\+58)|0)?4\d{9}$/,
  // Vietnam, numbers starting with 1-9 followed by 8 digits, with optional country code +84
  VN: /^(?:(?:\+84)|0)?[1-9]\d{8}$/,
  // Zambia, numbers starting with 1-9 followed by 8 or 9 digits, with optional country code +260
  ZM: /^(?:(?:\+260)|0)?[123456789]\d{8,9}$/,
  // Zimbabwe, 9 or 10 digits with optional country code +263
  ZW: /^(?:(?:\+263)|0)?(?:\d{9,10})$/,
  // Lithuania, 8 digits with optional country code +370 or national prefix 8
  LT: /^(?:(?:\+370)|8)\d{8}$/,
  // Luxembourg, numbers starting with 6 for mobile or 2 followed by 6, 7, 8, or 9 for landlines, followed by 6 digits
  LU: /^(?:(?:\+352)?(6|2(6|7|8|9))\d{6})$/,
  // Latvia, mobile numbers starting with 2 followed by 7 digits, with optional country code +371
  LV: /^(?:(?:\+371)?2\d{7})$/,
  // Montenegro, numbers starting with 6 or 7 followed by 7 to 20 digits, with optional country code +382
  ME: /^(?:(?:\+382)?[67]\d{7,20})$/,
  // Madagascar, numbers starting with 3 followed by 234568 and 7 digits, with optional country code +261
  MG: /^(?:(?:\+261)?3[234568]\d{7})$/,
  // Mozambique, numbers starting with 8 followed by 234567 and 7 or 8 digits, with optional country code +258
  MZ: /^(?:(?:\+258)|(?:258))?8[234567]\d{7,8}$/,
  // Netherlands, various formats including mobile (starting with 6) and landlines, with optional country code +31
  NL: /^(?:(?:\+31)|0(6(?:\d{8})|[1-9](?:(?:\d{8})|(?:\s\d{3}\s\d{4}))|(?:\d{8})))$/,
  // Panama, numbers starting with 4 or 6 followed by 6 or 7 digits, with optional country code +507
  PA: /^(?:(?:\+507)\s?)?[46]\d{6,7}$/,
  // Poland, various formats including 3 groups of 3 digits, or 2 groups of 4 digits and a final group of 2 digits, with optional country code +48
  PL: /^(?:(?:\+48)?(?:\s?\d{3}\s?\d{3}\s?\d{3}|(?:\d{2}\s?){4}\d{2}|\d{3}-\d{3}-\d{3}))$/,
  // Puerto Rico, numbers starting with 787 or 939 followed by 7 digits
  PR: /^(?:(?:\+1)?787|939)\d{7}$/,
  // Palestinian territories, mobile numbers starting with 5 followed by 2349 and 7 digits, with mandatory country code +970
  PS: /^(?:(?:\+970))(5[2349])\d{7}$/,
  // Portugal, mobile numbers starting with 9 followed by second digit 1 or 2(1-9) or 6(12345789) or 7(12345789) and 7 digits, with optional country code +351
  PT: /^(?:(?:\+351)?9(1\d|2[1-9]|6[12345789]|7[12345789])\d{7})$/,
  // Paraguay, mobile numbers starting with 9 followed by 9876 and 7 digits, with optional country code +595
  PY: /^(?:(?:\+595|0)9[9876]\d{7})$/,
  // Romania, mobile numbers starting with 7 followed by 2-8 and 7 digits or Bucharest landlines starting with 21 and 8 digits, with optional country code +40
  RO: /^(?:(?:\+40|0))(?:7[2-8]\d{7}|21\d{8})$/,
  // Serbia, numbers for various regions, including Belgrade (starting with 11) and mobiles (starting with 6), followed by 5 to 10 digits, with optional country code +381
  RS: /^(?:(?:\+381)|0)([0-6]|[7][012345])[0-9]{5,10}$/,
  // Rwanda, 9 digits with optional country code +250
  RW: /^(?:(?:\+250)|(0))\d{9}$/,
  // Slovenia, numbers starting with 1-5 and 9 followed by 7 or 8 digits, with optional country code +386
  SI: /^(?:(?:\+386)|0)?[1-59]\d{7,8}$/,
  // Slovakia, mobile numbers starting with 9 followed by 0-8 and 8 digits, with optional country code +421
  SK: /^(?:(?:\+421))?(0|9[0-8])\d{8}$/,
  // San Marino, landlines followed by 5 digits with optional country code +378 or starting with 0549 or 6
  SM: /^(?:(?:\+378)|(0549|6\d{4}))\d{5}$/,
  // Senegal, numbers starting with 3, 6, 7, or 9 followed by 7 digits, with optional country code +221
  SN: /^(?:(?:\+221)|0)?[3679]\d{7}$/,
  // Suriname, 7 digits with mandatory country code +597
  SR: /^(?:(?:\+597))\d{7}$/,
  // Togo, 8 digits with mandatory country code +228
  TG: /^(?:(?:\+228))\d{8}$/,
  // Tajikistan, numbers starting with 37, 55, or 77 followed by 7 digits, with mandatory country code +992
  TJ: /^(?:(?:\+992))(37|55|77)\d{7}$/,
  // Tunisia, landline numbers starting with 22, mobile numbers starting with 9 followed by 1-9, followed by 7 digits, with optional country code +216
  TN: /^(?:(?:\+216)|22|9[1-9])\d{7}$/,
  // Turkey, mobile numbers starting with 5 followed by 9 digits, with optional country code +90
  TR: /^(?:(?:\+90)|(0))\s?5\d{9}$/,
  // Taiwan, mobile numbers starting with 9 followed by 8 digits, with optional country code +886
  TW: /^(?:(?:\+886)|0)?9\d{8}$/,
  // Ukraine, various mobile operators codes followed by 7 digits, with optional country code +380
  UA: /^(?:(?:\+380)|(0))?(39|50|63|66|67|68|91|92|93|94|95|96|97|98|99)\d{7}$/,
  // Uganda, mobile numbers starting with 3 or 9 followed by 8 digits, with optional country code +256
  UG: /^(?:(?:\+256)|0)?[39]\d{8}$/,
  // Antigua and Barbuda, 7 digits with optional country code +1-268
  AG: /^(?:\+1-268)?(?:\d{7})$/,
  // Anguilla, 7 digits with optional country code +1-264
  AI: /^(?:\+1-264)?(?:\d{7})$/,
  // Angola, 9 digits with optional country code +244
  AO: /^(?:\+244)?(?:\d{9})$/,
  // American Samoa, 7 digits with optional country code +1-684
  AS: /^(?:\+1-684)?(?:\d{7})$/,
  // Austria, 4 to 13 digits with optional country code +43
  AT: /^(?:\+43)?(?:\d{4,13})$/,
  // Azerbaijan, 9 digits with optional country code +994
  AZ: /^(?:\+994)?(?:\d{9})$/,
  // Bosnia and Herzegovina, 6 to 8 digits with optional country code +387
  BA: /^(?:\+387)?(?:\d{6,8})$/,
  // Belgium, 8 or 9 digits with optional country code +32
  BE: /^(?:\+32)?(?:\d{8,9})$/,
  // Burkina Faso, 8 digits with optional country code +226
  BF: /^(?:\+226)?(?:\d{8})$/,
  // Bulgaria, 7 to 9 digits with optional country code +359
  BG: /^(?:\+359)?(?:\d{7,9})$/,
  // Burundi, 8 digits with optional country code +257
  BI: /^(?:\+257)?(?:\d{8})$/,
  // Benin, 8 digits with optional country code +229
  BJ: /^(?:\+229)?(?:\d{8})$/,
  // Bonaire, 7 digits with optional country code +599
  BQ: /^(?:\+599)?(?:\d{7})$/,
  // Brazil, 10 or 11 digits with optional country code +55
  BR: /^(?:\+55)?(?:\d{10,11})$/,
  // Bhutan, 8 digits with optional country code +975
  BT: /^(?:\+975)?(?:\d{8})$/,
  // Belarus, 9 digits with optional country code +375
  BY: /^(?:\+375)?(?:\d{9})$/,
  // Democratic Republic of the Congo, 9 digits with optional country code +243
  CD: /^(?:\+243)?(?:\d{9})$/,
  // Central African Republic, 8 digits with optional country code +236
  CF: /^(?:\+236)?(?:\d{8})$/,
  // Republic of the Congo, 9 digits with optional country code +242
  CG: /^(?:\+242)?(?:\d{9})$/,
  // Ivory Coast (Côte d'Ivoire), 8 digits with optional country code +225
  CI: /^(?:\+225)?(?:\d{8})$/,
  // Cook Islands, 5 digits with optional country code +682
  CK: /^(?:\+682)?(?:\d{5})$/,
  // Chile, 9 digits with optional country code +56
  CL: /^(?:\+56)?(?:\d{9})$/,
  // Cameroon, 9 digits with optional country code +237
  CM: /^(?:\+237)?(?:\d{9})$/,
  // Cape Verde, 7 digits with optional country code +238
  CV: /^(?:\+238)?(?:\d{7})$/,
  // Curaçao, 7 digits with optional country code +599
  CW: /^(?:\+599)?(?:\d{7})$/,
  // Cyprus, 8 digits with optional country code +357
  CY: /^(?:\+357)?(?:\d{8})$/,
  // Germany, 6 to 11 digits with optional country code +49
  DE: /^(?:\+49)?(?:\d{6,11})$/,
  // Djibouti, 6 digits with optional country code +253
  DJ: /^(?:\+253)?(?:\d{6})$/,
  // Dominica, 7 digits with optional country code +1-767
  DM: /^(?:\+1-767)?(?:\d{7})$/,
  // Ecuador, 8 or 9 digits with optional country code +593
  EC: /^(?:\+593)?(?:\d{8,9})$/,
  // Estonia, 7 or 8 digits with optional country code +372
  EE: /^(?:\+372)?(?:\d{7,8})$/,
  // Eritrea, 6 or 7 digits with optional country code +291
  ER: /^(?:\+291)?(?:\d{6,7})$/,
  // Spain, 9 digits with optional country code +34
  ES: /^(?:\+34)?(?:\d{9})$/,
  // Finland, 5 to 12 digits with optional country code +358
  FI: /^(?:\+358)?(?:\d{5,12})$/,
  // Falkland Islands, 5 digits with optional country code +500
  FK: /^(?:\+500)?(?:\d{5})$/,
  // Federated States of Micronesia, 7 digits with optional country code +691
  FM: /^(?:\+691)?(?:\d{7})$/,
  // Faroe Islands, 6 digits with optional country code +298
  FO: /^(?:\+298)?(?:\d{6})$/,
  // France, 9 digits with optional country code +33
  FR: /^(?:\+33)?(?:\d{9})$/,
  // Gabon, 6 or 7 digits with optional country code +241
  GA: /^(?:\+241)?(?:\d{6,7})$/,
  // Grenada, 7 digits with optional country code +1-473
  GD: /^(?:\+1-473)?(?:\d{7})$/,
  // Georgia, 8 or 9 digits with optional country code +995
  GE: /^(?:\+995)?(?:\d{8,9})$/,
  // Guam, 7 digits with optional country code +1-671
  GU: /^(?:\+1-671)?\d{7}$/,
  // Saint Kitts and Nevis, 7 digits with optional country code +1-869
  KN: /^(?:\+1-869)?\d{7}$/,
  // Saint Lucia, 7 digits with optional country code +1-758
  LC: /^(?:\+1-758)?\d{7}$/,
  // Northern Mariana Islands, 7 digits with optional country code +1-670
  MP: /^(?:\+1-670)?\d{7}$/,
  // Montserrat, 7 digits with optional country code +1-664
  MS: /^(?:\+1-664)?\d{7}$/,
  // Turks and Caicos Islands, 7 digits with optional country code +1-649
  TC: /^(?:\+1-649)?\d{7}$/,
  // British Virgin Islands, 7 digits with optional country code +1-284
  VG: /^(?:\+1-284)?\d{7}$/,
  // U.S. Virgin Islands, 7 digits with optional country code +1-340
  VI: /^(?:\+1-340)?\d{7}$/,
  // Greece, 10 digits with optional country code +30
  GR: /^(?:\+30)?\d{10}$/,
  // Italy, 9 or 10 digits with optional country code +39
  IT: /^(?:\+39)?\d{9,10}$/,
  // Vatican City, 8 to 12 digits with optional country code +379
  VA: /^(?:\+379)?\d{8,12}$/,
  // Japan, 10 digits with optional country code +81
  JP: /^(?:\+81)?\d{10}$/,
  // South Korea, 8 to 11 digits with optional country code +82
  KR: /^(?:\+82)?\d{8,11}$/,
  // Afghanistan, 9 digits with optional country code +93
  AF: /^(?:\+93)?\d{9}$/,
  // Iran, 10 digits with optional country code +98
  IR: /^(?:\+98)?\d{10}$/,
  // Libya, 9 digits with optional country code +218
  LY: /^(?:\+218)?\d{9}$/,
  // Mauritania, 8 digits with optional country code +222
  MR: /^(?:\+222)?\d{8}$/,
  // Mali, 8 digits with optional country code +223
  ML: /^(?:\+223)?\d{8}$/,
  // Guinea, 8 digits with optional country code +224
  GN: /^(?:\+224)?\d{8}$/,
  // Niger, 8 digits with optional country code +227
  NE: /^(?:\+227)?\d{8}$/,
  // Chad, 8 digits with optional country code +235
  TD: /^(?:\+235)?\d{8}$/,
  // São Tomé and Príncipe, 7 digits with optional country code +239
  ST: /^(?:\+239)?\d{7}$/,
  // Equatorial Guinea, 9 digits with optional country code +240
  GQ: /^(?:\+240)?\d{9}$/,
  // Guinea-Bissau, 7 digits with optional country code +245
  GW: /^(?:\+245)?\d{7}$/,
  // Sudan, 9 digits with optional country code +249
  SD: /^(?:\+249)?\d{9}$/,
  // Réunion, 9 digits with optional country code +262
  RE: /^(?:\+262)?\d{9}$/,
  // Mayotte, 9 digits with optional country code +262
  YT: /^(?:\+262)?\d{9}$/,
  // Comoros, 7 digits with optional country code +269
  KM: /^(?:\+269)?\d{7}$/,
  // Saint Helena, 4 or 5 digits with mandatory country code +290
  SH: /^(?:\+290)\d{4,5}$/,
  // Greenland, 6 digits with optional country code +299
  GL: /^(?:\+299)?\d{6}$/,
  // Ireland, 7 to 10 digits with optional country code +353
  IE: /^(?:\+353)?\d{7,10}$/,
  // Iceland, 7 digits with optional country code +354
  IS: /^(?:\+354)?\d{7}$/,
  // Malta, 8 digits with optional country code +356
  MT: /^(?:\+356)?\d{8}$/,
  // Andorra, 6 digits with optional country code +376
  AD: /^(?:\+376)?\d{6}$/,
  // Monaco, 8 or 9 digits with optional country code +377
  MC: /^(?:\+377)?\d{8,9}$/,
  // Kosovo, 8 digits with mandatory country code +383
  XK: /^(?:\+383)\d{8}$/,
  // Liechtenstein, 7 digits with optional country code +423
  LI: /^(?:\+423)?\d{7}$/,
  // Saint Martin (French part), 9 digits with optional country code +590
  MF: /^(?:\+590)?\d{9}$/,
  // French Guiana, 9 digits with optional country code +594
  GF: /^(?:\+594)?\d{9}$/,
  // Nauru, 7 digits with optional country code +674
  NR: /^(?:\+674)?\d{7}$/,
  // Tonga, 5 digits with optional country code +676
  TO: /^(?:\+676)?\d{5}$/,
  // Solomon Islands, 5 digits with optional country code +677
  SB: /^(?:\+677)?\d{5}$/,
  // Vanuatu, 7 digits with optional country code +678
  VU: /^(?:\+678)?\d{7}$/,
  // Palau, 7 digits with optional country code +680
  PW: /^(?:\+680)?\d{7}$/,
  // Niue, 4 digits with optional country code +683
  NU: /^(?:\+683)?\d{4}$/,
  // Samoa, 5 digits with optional country code +685
  WS: /^(?:\+685)?\d{5}$/,
  // Kiribati, 5 digits with optional country code +686
  KI: /^(?:\+686)?\d{5}$/,
  // New Caledonia, 6 digits with optional country code +687
  NC: /^(?:\+687)?\d{6}$/,
  // Tuvalu, 5 digits with optional country code +688
  TV: /^(?:\+688)?\d{5}$/,
  // French Polynesia, 6 digits with optional country code +689
  PF: /^(?:\+689)?\d{6}$/,
  // Marshall Islands, 7 digits with optional country code +692
  MH: /^(?:\+692)?\d{7}$/,
  // North Korea, 6 to 9 digits with mandatory country code +850
  KP: /^(?:\+850)\d{6,9}$/,
  // Lebanon, 8 digits with optional country code +961
  LB: /^(?:\+961)?\d{8}$/,
  // Jordan, 9 digits with optional country code +962
  JO: /^(?:\+962)?\d{9}$/,
  // Syria, 9 digits with optional country code +963
  SY: /^(?:\+963)?\d{9}$/,
  // Iraq, 10 digits with optional country code +964
  IQ: /^(?:\+964)?\d{10}$/,
  // Turkmenistan, 8 digits with optional country code +993
  TM: /^(?:\+993)?\d{8}$/,
  // Wallis and Futuna, 2 groups of 2 digits followed by 4 groups of 2 digits with optional country code +590 590
  FW: /^(?:\+590\s?590|\d{2})\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
};
