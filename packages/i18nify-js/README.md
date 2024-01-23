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

### Module 03: Date & Time Module

This module provides functions for formatting and manipulating dates and times in a locale-sensitive manner using the JavaScript Intl API & Date object.

#### add(date, value, unit)

🕒🚀 This nifty time traveler lets you leap through the calendar with ease! Whether you're planning future events or reminiscing the past, it swiftly adds days, months, or years to any given date. No more manual date calculations; this function uses JavaScript's Date object to fast-forward or rewind your dates seamlessly. 🗓️⏭️

##### Examples

```javascript
// Adding 10 days to today
console.log(add(new Date(), 10, 'days')); // Outputs a date 10 days from now

// Fast-forwarding 5 months from a specific date
console.log(add('2024-01-23', 5, 'months')); // Outputs a date 5 months after January 23, 2024

// Jumping 3 years into the future from a date object
console.log(add(new Date(2024, 0, 23), 3, 'years')); // Outputs a date 3 years after January 23, 2024
```

💡 No matter the format of your starting date—a string or a Date object—this function handles it. Just make sure your date string matches one of the recognized formats, or else you'll be time-traveling to the era of error messages! 🛑📅

#### formatDate(date, locale, intlOptions)

🌍📆 This global time stylist effortlessly turns your dates into beautifully formatted strings, tailored to different locales. Whether you're dealing with international clients or just love the beauty of diverse date formats, `formatDate` is your go-to function. It leverages the power of the Intl.DateTimeFormat API, ensuring that your dates always dress to impress, no matter where they're displayed. 🎩🌟

##### Examples

```javascript
// Basic date formatting
console.log(formatDate(new Date(), 'en-US')); // Outputs today's date in 'MM/DD/YYYY' format

// Formatting with different locale
console.log(formatDate('2024-05-20', 'de-DE')); // Outputs '20.05.2024'

// Using Intl.DateTimeFormat options
console.log(
  formatDate('2024-05-20', 'en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
); // Outputs 'Monday, 20 May 2024'
```

💡 Remember, if the date string doesn't match any supported formats, the function raises the curtain on an error message! 🛑🎭

#### formatDateTime(date, locale, intlOptions)

🕰️🌍 This savvy time tailor is your go-to for dressing up dates and times in locale-specific styles. Whether you're marking milestones, scheduling global meetings, or just need that perfect date-time format, `formatDateTime` uses the Internationalization API (Intl) to translate your dates and times into the local lingo. It's like having a linguistic time machine at your fingertips! 🌟🗓️

##### Examples

```javascript
// Standard date-time formatting
console.log(formatDateTime(new Date(), 'en-US')); // Outputs something like '1/23/2024, 10:00 AM'

// Custom date-time formatting in French
console.log(
  formatDateTime('2024-05-20 15:00', 'fr-FR', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }),
); // Outputs 'lundi, 15:00'

// Locale-specific date-time formatting with extended options
console.log(
  formatDateTime('2024-12-31 23:59', 'ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }),
); // Outputs '2024年12月31日 23:59:00'
```

💡 Remember, it's not just about translating the date and time; it's about presenting them in a way that feels natural and familiar to the user, no matter where they are in the world. 🌐⌚

#### formatTime(date, locale, intlOptions)

⏰🌐 This timely charmer is your key to unlocking the secrets of time presentation across different cultures. Using the wizardry of the Internationalization API (Intl), `formatTime` translates your time into a format that resonates with local customs and practices. Whether it's for scheduling international calls or just making sure you're in sync with the world's timezones, this function is your trusty sidekick in the realm of time formatting! 🌟⌚

##### Examples

```javascript
// Simple time formatting
console.log(formatTime(new Date(), 'en-US')); // Outputs something like '10:00 AM'

// Time formatting with extended options in French
console.log(
  formatTime('2024-05-20 15:00', 'fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }),
); // Outputs '15:00:00'

// Custom time formatting in Japanese
console.log(
  formatTime('2024-05-20 23:59', 'ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
); // Outputs '11:59 午後'
```

💡 Pro Tip: `formatTime` isn't just about showing the time; it's about presenting it in a way that's intuitive and familiar to your audience, wherever they may be. 🌍🕒

#### getFirstDayOfWeek(locale, intlOptions)

🌏📅 This global calendar guide is your key to unlocking the mysteries of the weekly cycle around the world! `getFirstDayOfWeek` dives into the diverse world of timekeeping, using the Internationalization API (Intl) to reveal which day each culture marks as the beginning of the week. Whether you're scheduling international events or just curious about global customs, this function is your go-to for aligning with local time traditions! 🔄🗓️

##### Examples

```javascript
// Discovering the first day of the week in the United States
console.log(getFirstDayOfWeek('en-US')); // Outputs 'Sunday'

// Finding out the first day of the week in France
console.log(getFirstDayOfWeek('fr-FR')); // Outputs 'Monday'

// Exploring the start of the week in Egypt
console.log(getFirstDayOfWeek('ar-EG')); // Outputs 'Saturday'
```

💡 Fun Fact: Did you know that while most of the world starts their week on Monday, some cultures consider Sunday or even Saturday as the first day? With `getFirstDayOfWeek`, you'll always be in sync with local weekly rhythms! 🌍🔍

#### getQuarter(date)

🗓️🌷🍂 This calendar connoisseur takes any date and magically determines its quarter, effortlessly dividing the year into four distinct parts. Whether you're tracking financial quarters, academic periods, or just curious about the season, `getQuarter` is your key to easily navigating through the year's chapters. A handy tool for anyone dealing with dates, from accountants to students! 🌟📚

##### Examples

```javascript
// Determining the quarter for a date in April
console.log(getQuarter('2024-04-15')); // Outputs 2 (Q2)

// Finding out the quarter for a date in November
console.log(getQuarter(new Date(2024, 10, 25))); // Outputs 4 (Q4)

// Identifying the quarter for a date in January
console.log(getQuarter('2024-01-01')); // Outputs 1 (Q1)
```

💡 Fun Fact: Did you know that quarters are not only useful in business and academia, but also in various forms of planning and analysis? With `getQuarter`, you'll always know where you stand in the rhythm of the year! 📈🍁

#### getRelativeTime(date, baseDate, locale, intlOptions)

⏳🌏 This time-traveling virtuoso effortlessly bridges the gap between dates, offering a glimpse into the past or a peek into the future. With the help of the Internationalization API (Intl), `getRelativeTime` transforms absolute dates into relatable, human-friendly phrases like '3 hours ago' or 'in 2 days'. Whether you're reminiscing the past or anticipating the future, this function keeps you connected to time in the most intuitive way! 🚀🕰️

##### Examples

```javascript
// How long ago was a past date?
console.log(getRelativeTime('2024-01-20', new Date())); // Outputs something like '3 days ago'

// How much time until a future date?
console.log(getRelativeTime('2024-01-26', new Date())); // Outputs 'in 3 days'

// Customizing output for different locales
console.log(getRelativeTime('2024-01-26', '2024-01-23', 'fr-FR')); // Outputs 'dans 3 jours' (in 3 days in French)
```

💡 Pro Tip: `getRelativeTime` is not just a way to express time differences; it's a bridge that connects your users to the temporal context in a way that's both meaningful and culturally aware. Time is more than seconds and minutes; it's a story, and this function helps you tell it! 📖⌚

#### getWeek(date)

📅🔢 This clever calendar companion swiftly calculates the week number for any given date, placing you precisely within the tapestry of the year. It's like having a bird's-eye view of the calendar, helping you navigate through the weeks with ease. Whether you're planning projects, tracking milestones, or simply curious about where you stand in the year, `getWeek` is your reliable guide through the annual journey! 🌟🗓️

##### Examples

```javascript
// Finding the week number for a date in January
console.log(getWeek('2024-01-15')); // Outputs the week number in January 2024

// Determining the week number for a date in mid-year
console.log(getWeek(new Date(2024, 5, 20))); // Outputs the week number in June 2024

// Calculating the week number for a date towards the end of the year
console.log(getWeek('2024-12-31')); // Outputs the week number at the end of December 2024
```

💡 Did You Know? The concept of week numbers is especially popular in business and academia for organizing schedules and events. With `getWeek`, staying on top of your plans becomes a breeze, giving you a clear view of your year at a glance! 🌍📊

#### getWeekdays(locale, intlOptions)

📅🌐 This global day-namer is your trusty guide through the week, no matter where you are in the world. Using the power of the Internationalization API (Intl), `getWeekdays` serves up the names of all seven days tailored to your chosen locale. From planning international meetings to creating a multilingual planner, this function provides the perfect blend of cultural awareness and practical utility, keeping you in sync with the local rhythm of life, one day at a time! 🌟🗓️

##### Examples

```javascript
// Getting weekdays in English
console.log(getWeekdays('en-US')); // Outputs ['Sunday', 'Monday', ..., 'Saturday']

// Discovering weekdays in French
console.log(getWeekdays('fr-FR')); // Outputs ['dimanche', 'lundi', ..., 'samedi']

// Exploring weekdays in Japanese
console.log(getWeekdays('ja-JP')); // Outputs ['日曜日', '月曜日', ..., '土曜日']
```

💡 Did You Know? The order and names of weekdays vary across cultures and languages. With `getWeekdays`, you can easily cater to a global audience, ensuring that your application speaks their language, quite literally! 🌍🗣️

#### isAfter(date1, date2)

⏱️🔍 This temporal detective is your go-to for solving date mysteries! `isAfter` takes two dates and cleverly reveals whether the first is indeed later than the second. It's like having a time-traveling magnifying glass, making it super easy to compare dates in your applications. Whether you're scheduling deadlines, organizing events, or just curious about the order of things, `isAfter` is your trusty sidekick in the world of time! 🌟📅

##### Examples

```javascript
// Checking if one date is after another
console.log(isAfter('2024-01-25', '2024-01-20')); // Outputs true (Jan 25, 2024 is after Jan 20, 2024)

// Comparing today with a future date
console.log(isAfter(new Date(), '2024-12-31')); // Outputs false if today is before Dec 31, 2024

// Comparing dates in different years
console.log(isAfter('2025-01-01', '2024-12-31')); // Outputs true (Jan 1, 2025 is after Dec 31, 2024)
```

💡 Pro Tip: `isAfter` isn't just a function; it's a time machine in your coding toolbox! Use it to prevent past dates in booking systems, validate deadlines, or even in time-sensitive games and activities. Time is in your hands now, code it wisely! 🎩⏳

#### isBefore(date1, date2)

⏳🔎 This is your chronological compass, guiding you through the timelines with ease! `isBefore` is the function that answers one of time's classic questions: Is this date before that one? It's an essential tool for applications dealing with deadlines, scheduling, and historical data. With `isBefore`, you can effortlessly determine the sequence of events, plan ahead, and ensure that you're not mixing up your yesterdays and tomorrows. 🌟📆

##### Examples

```javascript
// Checking if a date is before another
console.log(isBefore('2024-01-10', '2024-01-15')); // Outputs true if Jan 10, 2024 is before Jan 15, 2024

// Verifying if today is before a specific date
console.log(isBefore(new Date(), '2024-12-31')); // Outputs true if today is before Dec 31, 2024

// Comparing two dates in different years
console.log(isBefore('2023-12-31', '2024-01-01')); // Outputs true since Dec 31, 2023 is before Jan 1, 2024
```

💡 Pro Tip: `isBefore` is not just about past and future. It's about making informed decisions, managing timelines efficiently, and ensuring that everything happens at the right moment. Use it to navigate through the complexities of time with confidence and precision! 🎩⌛

#### isLeapYear(year)

🌌📅 Leap into the fascinating world of calendars with `isLeapYear`! This function is your trusty sidekick in unraveling the mysteries of the Gregorian calendar. It answers the question: Is this year a leap year? Leap years, with their extra day in February, keep our calendars aligned with Earth's orbit around the Sun. Whether you're scheduling events, programming a calendar application, or just satisfying your curiosity, `isLeapYear` is an essential tool. 🚀🗓️

##### Examples

```javascript
// Check if 2020 is a leap year
console.log(isLeapYear(2020)); // Outputs true, as 2020 is a leap year

// Verify if 2023 is a leap year
console.log(isLeapYear(2023)); // Outputs false, as 2023 is not a leap year

// Determine if 1900 is a leap year (it's not, despite being divisible by 4!)
console.log(isLeapYear(1900)); // Outputs false, as 1900 is not a leap year by Gregorian rules
```

💡 Pro Tip: `isLeapYear` not only simplifies date calculations but also serves as a fun fact generator! Impress your friends and colleagues with your knowledge about leap years and why they exist. Remember, every four years, we get that extra day, thanks to the quirks of our solar system and the way we track time! 🌍⏰🎉

#### isSameDay(date1, date2)

🌞📅 The `isSameDay` function is a calendar wizard's dream! It’s like having an eagle-eye view of your calendar, helping you pinpoint if two dates fall on the same glorious day. Whether you're organizing events, tracking special occasions, or coding up the next great scheduling app, `isSameDay` is your go-to for aligning dates with cosmic precision. 🌌🔍

##### Examples

```javascript
// Compare two dates for the same day
const firstDate = new Date(2022, 3, 15); // April 15, 2022
const secondDate = new Date(2022, 3, 15); // April 15, 2022
console.log(isSameDay(firstDate, secondDate)); // Outputs true, both dates are April 15, 2022

// Checking different days
const anotherDate = new Date(2022, 3, 16); // April 16, 2022
console.log(isSameDay(firstDate, anotherDate)); // Outputs false, different days!

// Works with string inputs too!
console.log(isSameDay('2022-04-15', '2022-04-15')); // Outputs true, both represent April 15, 2022
```

💡 Handy Tip: Use `isSameDay` to avoid double-booking, remember anniversaries, or even to trigger daily reminders. It's your silent guardian in the realm of dates, ensuring you're always on top of your day-to-day adventures. 🎯📆🚀

#### isValidDate(date)

🕵️‍♂️🗓️ The `isValidDate` function is like your personal detective for dates, adept at sniffing out the real from the imposters. It's an essential tool for ensuring that the date objects your application juggles are genuine and error-free. Whether it's user input, parsed data, or just a sanity check, `isValidDate` is your reliable sidekick in the world of dates and times. 🛡️⏳

##### Examples

```javascript
// Checking a valid date object
const validDate = new Date(2022, 3, 15);
console.log(isValidDate(validDate)); // Outputs true

// Testing a string that can be converted to a valid date
console.log(isValidDate('2022-04-15')); // Outputs true

// Trying out an invalid date string
console.log(isValidDate('Invalid Date String')); // Outputs false

// Testing with an invalid object
console.log(isValidDate({ year: 2022, month: 4, day: 15 })); // Outputs false
```

💡 Pro Tip: Use `isValidDate` to validate dates in forms, when parsing data, or before performing operations that require a valid date. It’s your trusty gatekeeper, ensuring that only true dates pass through. 🚦🔍📆

#### parseDateTime(dateInput, intlOptions, locale)

🔍🗓️ The `parseDateTime` function is like a time-traveler's best friend, expertly navigating the complex world of dates and times. Whether it's a string or a Date object you're dealing with, this function seamlessly transforms it into a comprehensive, easy-to-digest package of date information, tailored to any locale you desire. 🌍⏲️

##### Examples

```javascript
// Parsing a date string with default locale and options
const parsed1 = parseDateTime('18/01/2024');
console.log(parsed1); // Outputs object with detailed date components
/*
    {
        "day": "18",
        "month": "01",
        "year": "2024",
        "rawParts": [
            {
                "type": "day",
                "value": "18"
            },
            {
                "type": "literal",
                "value": "/"
            },
            {
                "type": "month",
                "value": "01"
            },
            {
                "type": "literal",
                "value": "/"
            },
            {
                "type": "year",
                "value": "2024"
            }
        ],
        "formattedDate": "18/01/2024",
        "dateObj": "2024-01-17T18:30:00.000Z"
    }
*/

// Parsing with specific locale and formatting options
const parsed2 = parseDateTime(
  '2024-01-23',
  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  'fr-FR',
);
console.log(parsed2); // Outputs object with formatted date in French
/*
    {
        "weekday": "mardi",
        "day": "23",
        "month": "janvier",
        "year": "2024",
        "rawParts": [
            {
                "type": "weekday",
                "value": "mardi"
            },
            {
                "type": "literal",
                "value": " "
            },
            {
                "type": "day",
                "value": "23"
            },
            {
                "type": "literal",
                "value": " "
            },
            {
                "type": "month",
                "value": "janvier"
            },
            {
                "type": "literal",
                "value": " "
            },
            {
                "type": "year",
                "value": "2024"
            }
        ],
        "formattedDate": "mardi 23 janvier 2024",
        "dateObj": "2024-01-22T18:30:00.000Z"
    }
*/

// Parsing a Date object
const parsed3 = parseDateTime(new Date(2024, 0, 23));
console.log(parsed3); // Outputs object with date components for January 23, 2024
/*
    {
        "day": "23",
        "month": "01",
        "year": "2024",
        "rawParts": [
            {
                "type": "day",
                "value": "23"
            },
            {
                "type": "literal",
                "value": "/"
            },
            {
                "type": "month",
                "value": "01"
            },
            {
                "type": "literal",
                "value": "/"
            },
            {
                "type": "year",
                "value": "2024"
            }
        ],
        "formattedDate": "23/01/2024",
        "dateObj": "2024-01-22T18:30:00.000Z"
    }
*/
```

💡 Pro Tip: Leverage `parseDateTime` in applications where detailed date analysis and manipulation are key, such as in calendar apps, scheduling tools, or date-sensitive data processing. It's like having a Swiss Army knife for all things related to dates and times! 📅🛠️

#### subtract(date, value, unit)

🕒🔙 The `subtract` function is like your personal time machine, allowing you to step back in time with ease. It's perfect for those moments when you need to calculate past dates, like figuring out what day it was 'x' days, months, or years ago. Simply tell it the time unit and how far back you want to go, and voilà! You're traveling back in time! 🚀🗓️

##### Examples

```javascript
// Subtracting days
console.log(subtract(new Date(2024, 0, 23), 10, 'days')); // Go back 10 days from Jan 23, 2024

// Subtracting months
console.log(subtract('2024-01-23', 2, 'months')); // Go back 2 months from Jan 23, 2024

// Subtracting years
console.log(subtract(new Date(2024, 0, 23), 5, 'years')); // Go back 5 years from Jan 23, 2024
```

💡 Pro Tip: Use the `subtract` function in applications like reminder services, historical data analysis, or anywhere you need to calculate past dates. It's a handy tool to have in your developer toolkit for managing date-based logic! 📅⏮️
