# i18nify

_A one-stop solution built in javascript to provide internationalization support._

Hey, dive into this JavaScript toolkit—it’s like having a magic kit for your app! 🪄✨ Picture this: modules for phoneNumber, currency, date—they’re like enchanted tools that make your app talk fluently in any language, anywhere! It’s your ticket to making your app a global citizen, no matter where it goes!

And hey, hang tight—I’ll break down each of these enchanting modules in the sections coming up! 🌍📱💸🗓️

## Install

`yarn add i18nify`

## Local Setup / Want to Contribute ?

Here’s your roadmap to getting this party started:

- First things first, clone this treasure trove of code (repository).
- Once you’ve done that, make sure all the buddies (dependencies) are in place by hitting `yarn install`
- You are good to go, go ahead find issues and raise your PR to fix those. Happy coding!!
- To create a build run following command: `yarn build`

Go on, code conqueror, the adventure awaits!

## Modules

### Core Module

Welcome to the command center for your i18n experience! This module serves as the control hub, housing the essential functions to manage your i18n settings seamlessly. This module offers a trio of functions to handle all your i18n needs. Whether it's checking the current state, customizing settings, or starting afresh, this module has got you covered in managing your i18n world! 🚀

#### Functions

**setState(newState: Partial`<I18nState>`):** Customize and update your i18n state with ease! Whether you're changing locales or tweaking directions, this function is your ticket to tailor your i18n experience precisely how you want it! 🎨

```
import { setState } from "@razorpay/i18nify-js/core";

// Set a new locale
setState({ locale: 'en-US' });
```

**getState():** Peek into the current i18n state – the active locale, direction, and country settings – at any time, giving you a snapshot of your i18n setup! 📸

```
import { getState } from '@razorpay/i18nify-js/core';

// Get the current state
const currentState = getState();
console.log(currentState);
    /*
    {
        locale: 'en-US',
        direction: '',
        country: '',
      }
    */
```

**resetState():** Made a mess? No worries! Hit the reset button with this function. It's the ultimate undo for your i18n adjustments, whisking your settings back to their pristine defaults. Fresh start, anyone? 🆕

```
import { resetState } from "@razorpay/i18nify-js/core";

// Reset everything!
resetState();
```

### Module 01: Currency

This module's your go-to guru for everything currency/number-related. 🤑 It's all about formatting, validations, and handy tricks to make dealing with money/numbers a breeze. Here are the cool APIs and utilities this Currency Module gives you to play with! 🚀💸

#### formatNumber(amount, options)

🎩✨ This little wizard helps you jazz up numerical values in all sorts of fancy ways. And guess what? It uses the Internationalization API (Intl) to sprinkle that magic dust and give you snazzy, locale-specific number formats—especially for currencies! 🌟💸

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

🌍💰 It’s your easy-peasy way to snag a whole list of currencies with their symbols and names. Simple, straightforward, and totally handy!

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

Picture this: it's like having a cool decoder ring for currency codes! 🔍💰 This little guy, grabs the symbol for a currency code from its secret stash.

##### Examples

```
console.log(getCurrencySymbol('USD')); // $

console.log(getCurrencySymbol('UZS')); // so'm

console.log(getCurrencySymbol('OMR')); // ر.ع.
```

#### formatNumberByParts(amount, options)

This slick function breaks down numbers into separate pieces using Intl.NumberFormat. It's like taking apart a puzzle 🧩 — currency symbol here, integers there, decimals in their place—with a fail-proof system to handle any formatting hiccups 🥴 along the way. Smooth operator, right?

##### Examples

```
console.log(
  formatNumberByParts(12345.67, {
    currency: "USD",
    locale: "en-US",
  })
); /* {
    "currency": "$",
    "integer": "12,345",
    "decimal": ".",
    "fraction": "67",
    "isPrefixSymbol": true,
    "parts": [
        {
            "type": "currency",
            "value": "$"
        },
        {
            "type": "integer",
            "value": "12"
        },
        {
            "type": "group",
            "value": ","
        },
        {
            "type": "integer",
            "value": "345"
        },
        {
            "type": "decimal",
            "value": "."
        },
        {
            "type": "fraction",
            "value": "67"
        }
    ]
} */

console.log(
  formatNumberByParts(12345.67, {
    currency: "XYZ",
    locale: "en-US",
  })
); /* {
    "currency": "XYZ",
    "integer": "12,345",
    "decimal": ".",
    "fraction": "67",
    "isPrefixSymbol": true,
    "parts": [
        {
            "type": "currency",
            "value": "XYZ"
        },
        {
            "type": "literal",
            "value": " "
        },
        {
            "type": "integer",
            "value": "12"
        },
        {
            "type": "group",
            "value": ","
        },
        {
            "type": "integer",
            "value": "345"
        },
        {
            "type": "decimal",
            "value": "."
        },
        {
            "type": "fraction",
            "value": "67"
        }
    ]
} */

console.log(
  formatNumberByParts(12345.67, {
    currency: "EUR",
    locale: "fr-FR",
  })
); /* {
    "integer": "12 345",
    "decimal": ",",
    "fraction": "67",
    "currency": "€",
    "isPrefixSymbol": false,
    "parts": [
        {
            "type": "integer",
            "value": "12"
        },
        {
            "type": "group",
            "value": " "
        },
        {
            "type": "integer",
            "value": "345"
        },
        {
            "type": "decimal",
            "value": ","
        },
        {
            "type": "fraction",
            "value": "67"
        },
        {
            "type": "literal",
            "value": " "
        },
        {
            "type": "currency",
            "value": "€"
        }
    ]
} */

console.log(
  formatNumberByParts(12345.67, {
    currency: "JPY",
    locale: "ja-JP",
  })
); /* {
    "currency": "￥",
    "integer": "12,346",
    "isPrefixSymbol": true,
    "parts": [
        {
            "type": "currency",
            "value": "￥"
        },
        {
            "type": "integer",
            "value": "12"
        },
        {
            "type": "group",
            "value": ","
        },
        {
            "type": "integer",
            "value": "346"
        }
    ]
} */

console.log(
  formatNumberByParts(12345.67, {
    currency: "OMR",
    locale: "ar-OM",
  })
); /* {
    "integer": "١٢٬٣٤٥",
    "decimal": "٫",
    "fraction": "٦٧٠",
    "currency": "ر.ع.",
    "isPrefixSymbol": false,
    "parts": [
        {
            "type": "literal",
            "value": " "
        },
        {
            "type": "integer",
            "value": "١٢"
        },
        {
            "type": "group",
            "value": "٬"
        },
        {
            "type": "integer",
            "value": "٣٤٥"
        },
        {
            "type": "decimal",
            "value": "٫"
        },
        {
            "type": "fraction",
            "value": "٦٧٠"
        },
        {
            "type": "literal",
            "value": " "
        },
        {
            "type": "currency",
            "value": "ر.ع."
        },
        {
            "type": "literal",
            "value": " "
        }
    ]
} */
```

### Module 02: Phone Number

This module’s your phone’s best friend, handling all things phone number-related. 📱 It’s the go-to for formatting, checking if those digits are legit, and all those handy phone-related tricks. And guess what? It’s got a bunch of cool stuff—APIs and utilities—just waiting for you to dive in and make your phone game strong! 🚀🔢

#### isValidPhoneNumber(phoneNumber, countryCode)

📞 It’s like the phone number detective, using fancy patterns to check if a number is the real deal for a specific country code. So, it’s pretty simple: if it says true, your number’s good to go for that country; if it’s false, time to double-check those digits! 🕵️‍♂️🔍

##### Examples

```
--> Basic Validation
console.log(isValidPhoneNumber('+14155552671')); // true

--> Specifying Country Code for Validation
console.log(isValidPhoneNumber('0501234567', 'AE')); // true

--> Auto-Detecting Country Code
console.log(isValidPhoneNumber('+447700900123')); // true

--> Handling Invalid Numbers
console.log(isValidPhoneNumber('123456789', 'US')); // false

--> Invalid Country Code
console.log(isValidPhoneNumber('+123456789')); // false

--> Empty Phone Number
console.log(isValidPhoneNumber('')); // false

--> Non-Standard Formatting
console.log(isValidPhoneNumber('(555) 555-5555')); // true
```

#### formatPhoneNumber(phoneNumber, countryCode)

📞 It’s like your personal phone number stylist, working its magic to make those digits look all snazzy. You can tell it the country code, or it’ll figure it out itself—then presto! It hands you back a phone number looking sharp and dapper in that country’s typical style. ✨🌍

##### Examples

```
--> Basic Formatting
console.log(formatPhoneNumber('+14155552671')); // '+1 415-555-2671'

--> Specifying Country Code for Formatting
console.log(formatPhoneNumber('0501234567', 'AE')); // '050 123 4567'

--> Auto-Detecting Country Code for Formatting
console.log(formatPhoneNumber('+447700900123')); // '+44 7700 900123'

--> Handling Invalid Numbers for Formatting
console.log(formatPhoneNumber('123456789', 'US')); // '123456789'

--> Invalid Country Code for Formatting
console.log(formatPhoneNumber('+123456789')); // '+123456789'

--> Empty Phone Number
console.log(formatPhoneNumber('')); // Throws an Error: 'Parameter `phoneNumber` is invalid!'

--> Non-Standard Formatting
console.log(formatPhoneNumber('(555) 555-5555')); // '555 555 5555'
```

#### parsePhoneNumber(phoneNumber, country)

🕵️‍♂️📞 This clever function digs deep into a phone number, pulling out all the juicy details: country code, dial code, the number all dolled up, and even the format it follows. What’s cool? It hands you back an object filled with all these deets, making it a breeze to access everything about that phone number. It’s like having the ultimate phone number cheat sheet! 🌟

##### Examples

```
--> Formatting a Phone Number
const phoneNumber = '+1 (555) 123-4567';
const parsedInfo = parsePhoneNumber(phoneNumber);
console.log('Country Code:', parsedInfo.countryCode); // 'US'
console.log('Formatted Number:', parsedInfo.formattedPhoneNumber); // '555-123-4567'
console.log('Dial Code:', parsedInfo.dialCode); // '+1'
console.log('Format Template:', parsedInfo.formatTemplate); // 'xxx-xxx-xxxx'

--> Parsing a Phone Number with Specified Country Code
const phoneNumber = '987654321'; // Phone number without country code
const countryCode = 'IN'; // Specifying the country code (India)
const parsedInfo = parsePhoneNumber(phoneNumber, countryCode);
console.log('Country Code:', parsedInfo.countryCode); // 'IN'
console.log('Formatted Number:', parsedInfo.formattedPhoneNumber); // '98-765-4321'
console.log('Dial Code:', parsedInfo.dialCode); ''
console.log('Format Template:', parsedInfo.formatTemplate); 'xxxx xxxxxx'

--> Handling Invalid Phone Numbers
try {
  const invalidPhoneNumber = ''; // Empty phone number
  // This will throw an error since the phone number is empty
  const parsedInfo = parsePhoneNumber(invalidPhoneNumber);
  // If the parsePhoneNumber function succeeds, log the parsed information
  console.log('Country Code:', parsedInfo.countryCode);
  console.log('Formatted Number:', parsedInfo.formattedPhoneNumber);
} catch (error) {
  console.error('Error:', error.message); // 'Parameter `phoneNumber` is invalid!'
}

--> Obtaining Format Information for a Country Code
const countryCode = 'JP'; // Country code for Japan
// Get the format information without providing a phone number
const parsedInfo = parsePhoneNumber('', countryCode);
console.log('Country Code:', parsedInfo.countryCode); // 'JP'
console.log('Format Template:', parsedInfo.formatTemplate); // 'xxx-xxxx-xxxx'
```
