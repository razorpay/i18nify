# i18nify

A one-stop solution built in javascript to provide internationalization support. This library contains various modules like phoneNumber, currency, date etc each dealing with certain functionalities that consumer can use to provide localisation support in the application. Each of these modules are discussed in great detail in the sections below

## Install

`yarn add i18nify`

## Local Setup / Want to Contribute ?

- Clone this repository.
- After cloning this repo, ensure dependencies are installed by running: `yarn install`
- You are good to go, go ahead find issues and raise your PR to fix those. Happy coding!!
- To create a build run following command: `yarn build`

## Modules

### Module 01: Currency

Module that deals with formatting, validations and all other related utilities focused on Currency. Below are the APIs/Utilities that Currency Module exposes for consumers.

#### formatNumber(amount, options)

The **_formatNumber_** function is designed to format numerical values, allowing customization based on various options. It leverages the Internationalization API (Intl) to generate locale-specific representations of numbers, particularly for currencies. This function takes an amount (either a string or a number) and optional parameters such as currency type, locale, and additional formatting options. Finally, it formats the amount according to the defined options and returns the formatted string representation.

##### Examples

```
console.log(formatNumber("1000.5", { currency: "USD" })); // $1,000.50

console.log(
  formatNumber("1500", {
    currency: "EUR",
    locale: "fr-FR",
    intlOptions: {
      currencyDisplay: "code",
    },
  })
); // 1 500,00 EUR

console.log(
  formatNumber("5000", {
    currency: "JPY",
    intlOptions: {
      currencyDisplay: "narrowSymbol",
    },
  })
); // ¥5,000
```

#### getCurrencyList()

The **_getCurrencyList_** function is a simple retrieval function that returns a list of currencies along with their respective symbols and names. This function does not modify the data but serves to provide access to the entire currency list defined within the application.

##### Examples

```
console.log(getCurrencyList()); /* {
  AED: { symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
  ALL: { symbol: 'Lek', name: 'Albanian Lek' },
  AMD: { symbol: '֏', name: 'Armenian Dram' },
  ARS: { symbol: 'ARS', name: 'Argentine Peso' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  AWG: { symbol: 'Afl.', name: 'Aruban Florin' },
  BBD: { symbol: '$', name: 'Barbadian Dollar' },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
  BMD: { symbol: '$', name: 'Bermudian Dollar' },
  BND: { symbol: 'BND', name: 'Brunei Dollar' },
  BOB: { symbol: 'Bs', name: 'Bolivian Boliviano' },
  BSD: { symbol: 'B$', name: 'Bahamian Dollar' },
  BWP: { symbol: 'P', name: 'Botswanan Pula' },
  BZD: { symbol: 'BZ$', name: 'Belize Dollar' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  CHF: { symbol: 'CHf', name: 'Swiss Franc' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  COP: { symbol: 'COL$', name: 'Colombian Peso' },
  CRC: { symbol: '₡', name: 'Costa Rican Colón' },
  CUP: { symbol: '$MN', name: 'Cuban Peso' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna' },
  DKK: { symbol: 'DKK', name: 'Danish Krone' },
  DOP: { symbol: 'RD$', name: 'Dominican Peso' },
  DZD: { symbol: 'د.ج', name: 'Algerian Dinar' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound' },
  ETB: { symbol: 'ብር', name: 'Ethiopian Birr' },
  EUR: { symbol: '€', name: 'Euro' },
  FJD: { symbol: 'FJ$', name: 'Fijian Dollar' },
  GBP: { symbol: '£', name: 'British Pound' },
  GHS: { symbol: 'GH₵', name: 'Ghanaian Cedi' },
  GIP: { symbol: 'GIP', name: 'Gibraltar Pound' },
  GMD: { symbol: 'D', name: 'Gambian Dalasi' },
  GTQ: { symbol: 'Q', name: 'Guatemalan Quetzal' },
  GYD: { symbol: 'G$', name: 'Guyanese Dollar' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
  HNL: { symbol: 'HNL', name: 'Honduran Lempira' },
  HRK: { symbol: 'kn', name: 'Croatian Kuna' },
  HTG: { symbol: 'G', name: 'Haitian Gourde' },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
  ILS: { symbol: '₪', name: 'Israeli New Shekel' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  JMD: { symbol: 'J$', name: 'Jamaican Dollar' },
  KES: { symbol: 'Ksh', name: 'Kenyan Shilling' },
  KGS: { symbol: 'Лв', name: 'Kyrgystani Som' },
  KHR: { symbol: '៛', name: 'Cambodian Riel' },
  KYD: { symbol: 'CI$', name: 'Cayman Islands Dollar' },
  KZT: { symbol: '₸', name: 'Kazakhstani Tenge' },
  LAK: { symbol: '₭', name: 'Laotian Kip' },
  LKR: { symbol: 'රු', name: 'Sri Lankan Rupee' },
  LRD: { symbol: 'L$', name: 'Liberian Dollar' },
  LSL: { symbol: 'LSL', name: 'Lesotho Loti' },
  MAD: { symbol: 'د.م.', name: 'Moroccan Dirham' },
  MDL: { symbol: 'MDL', name: 'Moldovan Leu' },
  MKD: { symbol: 'ден', name: 'Macedonian Denar' },
  MMK: { symbol: 'MMK', name: 'Myanmar Kyat' },
  MNT: { symbol: '₮', name: 'Mongolian Tugrik' },
  MOP: { symbol: 'MOP$', name: 'Macanese Pataca' },
  MUR: { symbol: '₨', name: 'Mauritian Rupee' },
  MVR: { symbol: 'Rf', name: 'Maldivian Rufiyaa' },
  MWK: { symbol: 'MK', name: 'Malawian Kwacha' },
  MXN: { symbol: 'Mex$', name: 'Mexican Peso' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
  NAD: { symbol: 'N$', name: 'Namibian Dollar' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  NIO: { symbol: 'NIO', name: 'Nicaraguan Córdoba' },
  NOK: { symbol: 'NOK', name: 'Norwegian Krone' },
  NPR: { symbol: 'रू', name: 'Nepalese Rupee' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
  PEN: { symbol: 'S/', name: 'Peruvian Nuevo Sol' },
  PGK: { symbol: 'PGK', name: 'Papua New Guinean Kina' },
  PHP: { symbol: '₱', name: 'Philippine Peso' },
  PKR: { symbol: '₨', name: 'Pakistani Rupee' },
  QAR: { symbol: 'QR', name: 'Qatari Riyal' },
  RUB: { symbol: '₽', name: 'Russian Ruble' },
  SAR: { symbol: 'SR', name: 'Saudi Riyal' },
  SCR: { symbol: 'SRe', name: 'Seychellois Rupee' },
  SEK: { symbol: 'SEK', name: 'Swedish Krona' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
  SLL: { symbol: 'Le', name: 'Sierra Leonean Leone' },
  SOS: { symbol: 'Sh.so.', name: 'Somali Shilling' },
  SSP: { symbol: 'SS£', name: 'South Sudanese Pound' },
  SVC: { symbol: '₡', name: 'Salvadoran Colón' },
  SZL: { symbol: 'E', name: 'Swazi Lilangeni' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  TTD: { symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
  TZS: { symbol: 'Sh', name: 'Tanzanian Shilling' },
  USD: { symbol: '$', name: 'United States Dollar' },
  UYU: { symbol: '$U', name: 'Uruguayan Peso' },
  UZS: { symbol: "so'm", name: 'Uzbekistani Som' },
  YER: { symbol: '﷼', name: 'Yemeni Rial' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  BHD: { symbol: 'د.ب.', name: 'Bahraini Dinar' },
  OMR: { symbol: 'ر.ع.', name: 'Omani Rial' },
} */
```

#### getCurrencySymbol(currencyCode)

The **_getCurrencySymbol_** function retrieves the symbol associated with a given currency code from a predefined list of currencies. It takes a currency code as an argument and checks if it exists within the currency list. If the code is valid, it returns the corresponding symbol for that currency. If the provided currency code is not found in the list, it throws an error indicating an invalid currency code.

##### Examples

```
console.log(getCurrencySymbol('USD')); // $

console.log(getCurrencySymbol('UZS')); // so'm

console.log(getCurrencySymbol('OMR')); // ر.ع.
```

#### formatNumberByParts(amount, options)

The **_formatNumberByParts_** function is a utility that formats a numerical value into its constituent parts based on specified options. It uses the Intl.NumberFormat API's formatToParts method to break down the formatted number into separate components such as integer, decimal, currency symbol, and separator.

This function takes an amount (either a string or a number) and optional parameters such as currency type, locale, and additional formatting options.

The output object structure adheres to the defined interface, providing access to individual components of the formatted number, including the currency symbol, integer part, decimal part, separator, and a boolean flag indicating whether the currency symbol appears at the beginning of the formatted string. If any errors occur during the formatting process, it throws an error with an accompanying message.

##### Examples

```
console.log(
  formatNumberByParts(12345.67, {
    currency: "USD",
    locale: "en-US",
  })
); /* {
      currencySymbol: '$',
      integerValue: '12,345',
      decimalValue: '67',
      separator: '.',
      symbolAtFirst: true,
    } */

console.log(
  formatNumberByParts(12345.67, {
    currency: "XYZ",
    locale: "en-US",
  })
); /* {
      currencySymbol: 'XYZ',
      decimalValue: '67',
      integerValue: '12,345',
      separator: '.',
      symbolAtFirst: true,
    } */

console.log(
  formatNumberByParts(12345.67, {
    currency: "EUR",
    locale: "fr-FR",
  })
); /* {
      currencySymbol: '€',
      decimalValue: '67',
      integerValue: '12 345',
      separator: ',',
      symbolAtFirst: false,
    } */

console.log(
  formatNumberByParts(12345.67, {
    currency: "JPY",
    locale: "ja-JP",
  })
); /* {
      currencySymbol: '￥',
      decimalValue: '',
      integerValue: '12,346',
      separator: '',
      symbolAtFirst: true,
    } */

console.log(
  formatNumberByParts(12345.67, {
    currency: "OMR",
    locale: "ar-OM",
  })
); /* {
      currencySymbol: 'ر.ع.',
      decimalValue: '٦٧٠',
      integerValue: '١٢٬٣٤٥',
      separator: '٫',
      symbolAtFirst: false,
    } */
```

### Module 02: Phone Number

Module that deals with formatting, validations and all other related utilities focused on Phone Number. Below are the APIs/Utilities that Phone Number Module exposes for consumers.

#### validatePhoneNumber(phoneNumber, countryCode)

The **_validatePhoneNumber_** function serves the purpose of determining the validity of a provided phone number against predefined regular expression patterns specific to various country codes. This function returns a boolean value, true indicating the phone number's validity for the specified country code and false otherwise.

#### formatPhoneNumber(phoneNumber, countryCode)

The **_formatPhoneNumber_** function is designed to format a given phone number based on the specified country code or infers the country code from the provided phone number. This function returns a formatted phone number string that aligns with the conventional format of the detected or specified country.

#### parsePhoneNumber(phoneNumber)

The **_parsePhoneNumber_** function undertakes the task of extracting comprehensive information from a given phone number. This information includes the country code, dial code, formatted number, and the format template employed. This function returns an object containing these extracted details, allowing easy access and reference to the pertinent information related to the provided phone number.
