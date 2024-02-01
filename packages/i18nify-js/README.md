# i18nify-JS

_A one-stop solution built in javascript to provide internationalization support._

Hey, dive into this JavaScript toolkit—it’s like having a magic kit for your app! 🪄✨ Picture this: modules for phoneNumber, currency, date—they’re like enchanted tools that make your app talk fluently in any language, anywhere! It’s your ticket to making your app a global citizen, no matter where it goes!

And hey, hang tight—I’ll break down each of these enchanting modules in the sections coming up! 🌍📱💸🗓️

## Install

`yarn add @razorpay/i18nify-js`

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

**setState(newState: Partial `<I18nState>`):** Customize and update your i18n state with ease! Whether you're changing locales or tweaking directions, this function is your ticket to tailor your i18n experience precisely how you want it! 🎨

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

#### convertFromLowerDenominationToUpperDenomination(amount, currencyCode)

💵🔄 This function is your go-to tool for scaling currency values from lower to higher denominations. Just input the amount in a lower denomination (like cents or pence) along with the currency code, and voilà! You get the amount in a higher denomination (like dollars or pounds). And if you stumble upon an unsupported currency code, it'll promptly let you know by throwing an error.

##### Examples

```javascript
console.log(convertFromLowerDenominationToUpperDenomination(10000, "USD")); // Outputs the amount in dollars for 10000 cents (e.g., 100.00 if the conversion rate is 100)
console.log(convertFromLowerDenominationToUpperDenomination(5000, "GBP")); // Converts 5000 pence to pounds (e.g., 50.00 if the conversion rate is 100)
```

#### getCurrencyConversionRate(currencyCode)

🔄💹 Need the inside scoop on currency conversion rates? This function fetches you the conversion rate from lower to higher currency denominations for the specified currency code. And just like a cautious friend, it'll throw an error if you ask about a currency that's not on its list.

##### Examples

```javascript
console.log(getCurrencyConversionRate("USD")); // output 100, representing the conversion rate from cents to dollars
console.log(getCurrencyConversionRate("GBP")); // output 100, representing the conversion rate from pence to pounds
```

These additional functionalities seamlessly integrate with the existing currency module, ensuring you have a robust and versatile toolset for all your currency-formatting and conversion needs! 🌟💰

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
  AED: {
    symbol: 'د.إ',
    name: 'United Arab Emirates Dirham',
    lowerUnitName: 'Fils',
    conversionRate: 100
  },
  ALL: {
    symbol: 'Lek',
    name: 'Albanian Lek',
    lowerUnitName: 'Qindarka',
    conversionRate: 100
  },
  AMD: {
    symbol: '֏',
    name: 'Armenian Dram',
    lowerUnitName: 'Luma',
    conversionRate: 100
  },
  ARS: {
    symbol: 'ARS',
    name: 'Argentine Peso',
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  AUD: {
    symbol: 'A$',
    name: 'Australian Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  AWG: {
    symbol: 'Afl.',
    name: 'Aruban Florin',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  BBD: {
    symbol: '$',
    name: 'Barbadian Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  BDT: {
    symbol: '৳',
    name: 'Bangladeshi Taka',
    lowerUnitName: 'Poisha',
    conversionRate: 100
  },
  BMD: {
    symbol: '$',
    name: 'Bermudian Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  BND: {
    symbol: 'BND',
    name: 'Brunei Dollar',
    lowerUnitName: 'Sen',
    conversionRate: 100
  },
  BOB: {
    symbol: 'Bs',
    name: 'Bolivian Boliviano',
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  BSD: {
    symbol: 'B$',
    name: 'Bahamian Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  BWP: {
    symbol: 'P',
    name: 'Botswanan Pula',
    lowerUnitName: 'Thebe',
    conversionRate: 100
  },
  BZD: {
    symbol: 'BZ$',
    name: 'Belize Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  CAD: {
    symbol: 'C$',
    name: 'Canadian Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  CHF: {
    symbol: 'CHf',
    name: 'Swiss Franc',
    lowerUnitName: 'Rappen',
    conversionRate: 100
  },
  CNY: {
    symbol: '¥',
    name: 'Chinese Yuan',
    lowerUnitName: 'Fen',
    conversionRate: 100
  },
  COP: {
    symbol: 'COL$',
    name: 'Colombian Peso',
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  CRC: {
    symbol: '₡',
    name: 'Costa Rican Colón',
    lowerUnitName: 'Céntimo',
    conversionRate: 100
  },
  CUP: {
    symbol: '$MN',
    name: 'Cuban Peso',
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  CZK: {
    symbol: 'Kč',
    name: 'Czech Koruna',
    lowerUnitName: 'Haléř',
    conversionRate: 100
  },
  DKK: {
    symbol: 'DKK',
    name: 'Danish Krone',
    lowerUnitName: 'Øre',
    conversionRate: 100
  },
  DOP: {
    symbol: 'RD$',
    name: 'Dominican Peso',
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  DZD: {
    symbol: 'د.ج',
    name: 'Algerian Dinar',
    lowerUnitName: 'Santeem',
    conversionRate: 100
  },
  EGP: {
    symbol: 'E£',
    name: 'Egyptian Pound',
    lowerUnitName: 'Piastre',
    conversionRate: 100
  },
  ETB: {
    symbol: 'ብር',
    name: 'Ethiopian Birr',
    lowerUnitName:'Santim',
    conversionRate: 100
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  FJD: {
    symbol: 'FJ$',
    name: 'Fijian Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    lowerUnitName: 'Penny',
    conversionRate: 100
  },
  GHS: {
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    lowerUnitName: 'Pesewa',
    conversionRate: 100
  },
  GIP: {
    symbol: 'GIP',
    name: 'Gibraltar Pound',
    lowerUnitName: 'Penny',
    conversionRate: 100
  },
  GMD: {
    symbol: 'D',
    name: 'Gambian Dalasi',
    lowerUnitName: 'Butut',
    conversionRate: 100
  },
  GTQ: {
    symbol: 'Q',
    name: 'Guatemalan Quetzal',
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  GYD: {
    symbol: 'G$',
    name: 'Guyanese Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  HKD: {
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  HNL: {
    symbol: 'HNL',
    name: 'Honduran Lempira',
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  HRK: {
    symbol: 'kn',
    name: 'Croatian Kuna',
    lowerUnitName: 'Lipa',
    conversionRate: 100
  },
  HTG: {
    symbol: 'G',
    name: 'Haitian Gourde',
    minorUnits: 2,
    lowerUnitName: 'Centime',
    conversionRate: 100
  },
  HUF: {
    symbol: 'Ft',
    name: 'Hungarian Forint',
    minorUnits: 2,
    lowerUnitName: 'Fillér',
    conversionRate: 100
  },
  IDR: {
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    minorUnits: 2,
    lowerUnitName: 'Sen',
    conversionRate: 100
  },
  ILS: {
    symbol: '₪',
    name: 'Israeli New Shekel',
    minorUnits: 2,
    lowerUnitName: 'Agora',
    conversionRate: 100
  },
  INR: {
    symbol: '₹',
    name: 'Indian Rupee',
    minorUnits: 2,
    lowerUnitName: 'Paisa',
    conversionRate: 100
  },
  JMD: {
    symbol: 'J$',
    name: 'Jamaican Dollar',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  KES: {
    symbol: 'Ksh',
    name: 'Kenyan Shilling',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  KGS: {
    symbol: 'Лв',
    name: 'Kyrgystani Som',
    minorUnits: 2,
    lowerUnitName: 'Tyiyn',
    conversionRate: 100
  },
  KHR: {
    symbol: '៛',
    name: 'Cambodian Riel',
    minorUnits: 2,
    lowerUnitName: 'Sen',
    conversionRate: 100
  },
  KYD: {
    symbol: 'CI$',
    name: 'Cayman Islands Dollar',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  KZT: {
    symbol: '₸',
    name: 'Kazakhstani Tenge',
    minorUnits: 2,
    lowerUnitName: 'Tiyn',
    conversionRate: 100
  },
  LAK: {
    symbol: '₭',
    name: 'Laotian Kip',
    minorUnits: 2,
    lowerUnitName: 'Att',
    conversionRate: 100
  },
  LKR: {
    symbol: 'රු',
    name: 'Sri Lankan Rupee',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  LRD: {
    symbol: 'L$',
    name: 'Liberian Dollar',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  LSL: {
    symbol: 'LSL',
    name: 'Lesotho Loti',
    minorUnits: 2,
    lowerUnitName: 'Sente',
    conversionRate: 100
  },
  MAD: {
    symbol: 'د.م.',
    name: 'Moroccan Dirham',
    minorUnits: 2,
    lowerUnitName: 'Centime',
    conversionRate: 100
  },
  MDL: {
    symbol: 'MDL',
    name: 'Moldovan Leu',
    minorUnits: 2,
    lowerUnitName: 'Ban',
    conversionRate: 100
  },
  MKD: {
    symbol: 'ден',
    name: 'Macedonian Denar',
    minorUnits: 2,
    lowerUnitName: 'Deni',
    conversionRate: 100
  },
  MMK: {
    symbol: 'MMK',
    name: 'Myanmar Kyat',
    minorUnits: 2,
    lowerUnitName: 'Pya',
    conversionRate: 100
  },
  MNT: {
    symbol: '₮',
    name: 'Mongolian Tugrik',
    minorUnits: 2,
    lowerUnitName: 'Möngö',
    conversionRate: 100
  },
  MOP: {
    symbol: 'MOP$',
    name: 'Macanese Pataca',
    minorUnits: 2,
    lowerUnitName: 'Avo',
    conversionRate: 100
  },
  MUR: {
    symbol: '₨',
    name: 'Mauritian Rupee',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  MVR: {
    symbol: 'Rf',
    name: 'Maldivian Rufiyaa',
    minorUnits: 2,
    lowerUnitName: 'Laari',
    conversionRate: 100
  },
  MWK: {
    symbol: 'MK',
    name: 'Malawian Kwacha',
    minorUnits: 2,
    lowerUnitName: 'Tambala',
    conversionRate: 100
  },
  MXN: {
    symbol: 'Mex$',
    name: 'Mexican Peso',
    minorUnits: 2,
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  MYR: {
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    minorUnits: 2,
    lowerUnitName: 'Sen',
    conversionRate: 100
  },
  NAD: {
    symbol: 'N$',
    name: 'Namibian Dollar',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  NGN: {
    symbol: '₦',
    name: 'Nigerian Naira',
    minorUnits: 2,
    lowerUnitName: 'Kobo',
    conversionRate: 100
  },
  NIO: {
    symbol: 'NIO',
    name: 'Nicaraguan Córdoba',
    minorUnits: 2,
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  NOK: {
    symbol: 'NOK',
    name: 'Norwegian Krone',
    minorUnits: 2,
    lowerUnitName: 'Øre',
    conversionRate: 100
  },
  NPR: {
    symbol: 'रू',
    name: 'Nepalese Rupee',
    minorUnits: 2,
    lowerUnitName: 'Paisa',
    conversionRate: 100
  },
  NZD: {
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  PEN: {
    symbol: 'S/',
    name: 'Peruvian Nuevo Sol',
    minorUnits: 2,
    lowerUnitName: 'Céntimo',
    conversionRate: 100
  },
  PGK: {
    symbol: 'PGK',
    name: 'Papua New Guinean Kina',
    minorUnits: 2,
    lowerUnitName: 'Toea',
    conversionRate: 100
  },
  PHP: {
    symbol: '₱',
    name: 'Philippine Peso',
    minorUnits: 2,
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  PKR: {
    symbol: '₨',
    name: 'Pakistani Rupee',
    minorUnits: 2,
    lowerUnitName: 'Paisa',
    conversionRate: 100
  },
  QAR: {
    symbol: 'QR',
    name: 'Qatari Riyal',
    minorUnits: 2,
    lowerUnitName: 'Dirham',
    conversionRate: 100
  },
  RUB: {
    symbol: '₽',
    name: 'Russian Ruble',
    minorUnits: 2,
    lowerUnitName: 'Kopeck',
    conversionRate: 100
  },
  SAR: {
    symbol: 'SR',
    name: 'Saudi Riyal',
    minorUnits: 2,
    lowerUnitName: 'Halala',
    conversionRate: 100
  },
  SCR: {
    symbol: 'SRe',
    name: 'Seychellois Rupee',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  SEK: {
    symbol: 'SEK',
    name: 'Swedish Krona',
    minorUnits: 2,
    lowerUnitName: 'Öre',
    conversionRate: 100
  },
  SGD: {
    symbol: 'S$',
    name: 'Singapore Dollar',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  SLL: {
    symbol: 'Le',
    name: 'Sierra Leonean Leone',
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  SOS: {
    symbol: 'Sh.so.',
    name: 'Somali Shilling',
    minorUnits: 2,
    lowerUnitName: 'Senti',
    conversionRate: 100
  },
  SSP: {
    symbol: 'SS£',
    name: 'South Sudanese Pound',
    minorUnits: 2,
    lowerUnitName: 'Piaster',
    conversionRate: 100
  },
  SVC: {
    symbol: '₡',
    name: 'Salvadoran Colón',
    minorUnits: 2,
    lowerUnitName: 'Centavo',
    conversionRate: 100
  },
  SZL: {
    symbol: 'E',
    name: 'Swazi Lilangeni',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  THB: {
    symbol: '฿',
    name: 'Thai Baht',
    minorUnits: 2,
    lowerUnitName: 'Satang',
    conversionRate: 100
  },
  TTD: {
    symbol: 'TT$',
    name: 'Trinidad and Tobago Dollar',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  TZS: {
    symbol: 'Sh',
    name: 'Tanzanian Shilling',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  USD: {
    symbol: '$',
    name: 'United States Dollar',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  UYU: {
    symbol: '$U',
    name: 'Uruguayan Peso',
    minorUnits: 2,
    lowerUnitName: 'Centésimo',
    conversionRate: 100
  },
  UZS: {
    symbol: "so'm",
    name: 'Uzbekistani Som',
    minorUnits: 2,
    lowerUnitName: 'Tiyin',
    conversionRate: 100
  },
  YER: {
    symbol: '﷼',
    name: 'Yemeni Rial',
    minorUnits: 2,
    lowerUnitName: 'Fils',
    conversionRate: 100
  },
  ZAR: {
    symbol: 'R',
    name: 'South African Rand',
    minorUnits: 2,
    lowerUnitName: 'Cent',
    conversionRate: 100
  },
  KWD: {
    symbol: 'د.ك',
    name: 'Kuwaiti Dinar',
    minorUnits: 3,
    lowerUnitName: 'Fils',
    conversionRate: 1000
  },
  BHD: {
    symbol: 'د.ب.',
    name: 'Bahraini Dinar',
    minorUnits: 3,
    lowerUnitName: 'Fils',
    conversionRate: 1000
  },
  OMR: {
    symbol: 'ر.ع.',
    name: 'Omani Rial',
    minorUnits: 3,
    lowerUnitName: 'Baisa',
    conversionRate: 1000
  },
  JPY: {
    symbol: '¥',
    name: 'Japanese Yen',
    minorUnits: 0,
    lowerUnitName: '',
    conversionRate: 1
  }
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
    "rawParts": [
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
    "rawParts": [
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
    "rawParts": [
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
    "rawParts": [
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
    "rawParts": [
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
