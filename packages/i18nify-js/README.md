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

#### convertToMajorUnit(amount, options)

💵🔄 This function is your go-to tool for scaling currency values from lower to major units. Just input the amount in a minor unit (like cents or pence) along with the currency code, and voilà! You get the amount in a major unit (like dollars or pounds). And if you stumble upon an unsupported currency code, it'll promptly let you know by throwing an error.

##### Examples

```javascript
console.log(convertToMajorUnit(10000, 'USD')); // Outputs the amount in dollars for 10000 cents (e.g., 100.00)
console.log(convertToMajorUnit(5000, 'GBP')); // Converts 5000 pence to pounds (e.g., 50.00)
```

#### convertToMinorUnit(amount, options)

💵🔄 This function is your go-to tool for scaling currency values from higher to minor units. Just input the amount in a major unit (like dollars or pounds) along with the currency code, and voilà! You get the amount in a minor unit (like cents or pence). And if you stumble upon an unsupported currency code, it'll promptly let you know by throwing an error.

##### Examples

```javascript
console.log(convertToMinorUnit(100, 'USD')); // Outputs the amount in cents for 10000 dollars (e.g., 10000)
console.log(convertToMinorUnit(50, 'GBP')); // Converts 50 pounds to pence (e.g., 5000)
```

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
  },
  ALL: {
    symbol: 'Lek',
    name: 'Albanian Lek',
    lowerUnitName: 'Qindarka',
  },
  AMD: {
    symbol: '֏',
    name: 'Armenian Dram',
    lowerUnitName: 'Luma',
  },
  ARS: {
    symbol: 'ARS',
    name: 'Argentine Peso',
    lowerUnitName: 'Centavo',
  },
  AUD: {
    symbol: 'A$',
    name: 'Australian Dollar',
    lowerUnitName: 'Cent',
  },
  ... rest of the country
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

#### formatDate(date, options)

🌍📆 This global time stylist effortlessly turns your dates into beautifully formatted strings, tailored to different locales. Whether you're dealing with international clients or just love the beauty of diverse date formats, `formatDate` is your go-to function. It leverages the power of the Intl.DateTimeFormat API, ensuring that your dates always dress to impress, no matter where they're displayed. 🎩🌟

##### Examples

```javascript
// Basic date formatting
console.log(formatDate(new Date(), {locale: 'en-US'})); // Outputs today's date in 'MM/DD/YYYY' format

// Formatting with different locale
console.log(formatDate('2024-05-20', {locale: 'de-DE'})); // Outputs '20.05.2024'

// Using Intl.DateTimeFormat options
console.log(
  formatDate('2024-05-20', {locale: 'en-GB', intlOptions: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }}),
); // Outputs 'Monday, 20 May 2024'
```

💡 Remember, if the date string doesn't match any supported formats, the function raises the curtain on an error message! 🛑🎭

#### formatDateTime(date, options)

🕰️🌍 This savvy time tailor is your go-to for dressing up dates and times in locale-specific styles. Whether you're marking milestones, scheduling global meetings, or just need that perfect date-time format, `formatDateTime` uses the Internationalization API (Intl) to translate your dates and times into the local lingo. It's like having a linguistic time machine at your fingertips! 🌟🗓️

##### Examples

```javascript
// Standard date-time formatting
console.log(formatDateTime(new Date(), {locale: 'en-US'})); // Outputs something like '1/23/2024, 10:00 AM'

// Custom date-time formatting in French
console.log(
  formatDateTime('2024-05-20 15:00', {locale: 'fr-FR', intlOptions: {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }}),
); // Outputs 'lundi, 15:00'

// Locale-specific date-time formatting with extended options
console.log(
  formatDateTime('2024-12-31 23:59', {locale: 'ja-JP', intlOptions: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }}),
); // Outputs '2024年12月31日 23:59:00'
```

💡 Remember, it's not just about translating the date and time; it's about presenting them in a way that feels natural and familiar to the user, no matter where they are in the world. 🌐⌚

#### formatTime(date, options)

⏰🌐 This timely charmer is your key to unlocking the secrets of time presentation across different cultures. Using the wizardry of the Internationalization API (Intl), `formatTime` translates your time into a format that resonates with local customs and practices. Whether it's for scheduling international calls or just making sure you're in sync with the world's timezones, this function is your trusty sidekick in the realm of time formatting! 🌟⌚

##### Examples

```javascript
// Simple time formatting
console.log(formatTime(new Date(), {locale: 'en-US'})); // Outputs something like '10:00 AM'

// Time formatting with extended options in French
console.log(
  formatTime('2024-05-20 15:00', {locale: 'fr-FR', intlOptions: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }}),
); // Outputs '15:00:00'

// Custom time formatting in Japanese
console.log(
  formatTime('2024-05-20 23:59', {locale: 'ja-JP', intlOptions: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }}),
); // Outputs '11:59 午後'
```

💡 Pro Tip: `formatTime` isn't just about showing the time; it's about presenting it in a way that's intuitive and familiar to your audience, wherever they may be. 🌍🕒

#### getRelativeTime(date, baseDate, options)

⏳🌏 This time-traveling virtuoso effortlessly bridges the gap between dates, offering a glimpse into the past or a peek into the future. With the help of the Internationalization API (Intl), `getRelativeTime` transforms absolute dates into relatable, human-friendly phrases like '3 hours ago' or 'in 2 days'. Whether you're reminiscing the past or anticipating the future, this function keeps you connected to time in the most intuitive way! 🚀🕰️

##### Examples

```javascript
// How long ago was a past date?
console.log(getRelativeTime('2024-01-20', new Date())); // Outputs something like '3 days ago'

// How much time until a future date?
console.log(getRelativeTime('2024-01-26', new Date())); // Outputs 'in 3 days'

// Customizing output for different locales
console.log(getRelativeTime('2024-01-26', '2024-01-23', {locale: 'fr-FR'})); // Outputs 'dans 3 jours' (in 3 days in French)
```

💡 Pro Tip: `getRelativeTime` is not just a way to express time differences; it's a bridge that connects your users to the temporal context in a way that's both meaningful and culturally aware. Time is more than seconds and minutes; it's a story, and this function helps you tell it! 📖⌚

#### getWeekdays(options)

📅🌐 This global day-namer is your trusty guide through the week, no matter where you are in the world. Using the power of the Internationalization API (Intl), `getWeekdays` serves up the names of all seven days tailored to your chosen locale. From planning international meetings to creating a multilingual planner, this function provides the perfect blend of cultural awareness and practical utility, keeping you in sync with the local rhythm of life, one day at a time! 🌟🗓️

##### Examples

```javascript
// Getting weekdays in English
console.log(getWeekdays({locale: 'en-US'})); // Outputs ['Sunday', 'Monday', ..., 'Saturday']

// Discovering weekdays in French
console.log(getWeekdays({locale: 'fr-FR'})); // Outputs ['dimanche', 'lundi', ..., 'samedi']

// Exploring weekdays in Japanese
console.log(getWeekdays({locale: 'ja-JP'})); // Outputs ['日曜日', '月曜日', ..., '土曜日']
```

💡 Did You Know? The order and names of weekdays vary across cultures and languages. With `getWeekdays`, you can easily cater to a global audience, ensuring that your application speaks their language, quite literally! 🌍🗣️

#### isValidDate(dateString)

🕵️‍♂️🗓️ The `isValidDate` function now comes with an international flair! It's a robust date validator that not only checks if a date is valid but also ensures it aligns with the date format of a specific locale. Perfect for applications catering to a global audience, it scrutinizes dates against various international formats, making it a versatile tool in your date validation arsenal. 🌍⏳

##### Examples

```javascript
console.log(isValidDate('15/04/2022')); // Outputs false

console.log(isValidDate('04-15-2022')); // Outputs true

console.log(isValidDate('2022-15-04')); // Outputs false

console.log(isValidDate('15.04.2022')); // Outputs false
```

💡 Pro Tip: Employ `isValidDate` for validating user inputs in internationalized applications, ensuring compatibility with locale-specific date formats. It’s your trusty guardian, assuring that dates align with regional norms. 🚦🔍🌐

#### parseDateTime(dateInput, options:)

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
  {
    intlOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    locale: 'fr-FR',
  }
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
