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

#### setState(newState)

Customize and update your i18n state with ease! Whether you're changing locales or tweaking directions, this function is your ticket to tailor your i18n experience precisely how you want it! 🎨

##### Examples

```javascript
import { setState } from '@razorpay/i18nify-js/core';

// Set a new locale
setState({ locale: 'en-US' });
```

#### getState()

Peek into the current i18n state – the active locale, direction, and country settings – at any time, giving you a snapshot of your i18n setup! 📸

##### Examples

```javascript
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

#### resetState()

Made a mess? No worries! Hit the reset button with this function. It's the ultimate undo for your i18n adjustments, whisking your settings back to their pristine defaults. Fresh start, anyone? 🆕

##### Examples

```javascript
import { resetState } from '@razorpay/i18nify-js/core';

// Reset everything!
resetState();
```

### getAllLocales()

The `getAllLocales` function 🌐🔍 is your comprehensive guide to the linguistic landscape of the world. Acting as a detailed atlas, it provides a panoramic view of the diverse locales across all countries, from the bustling cities of Japan to the tranquil countryside of France. This function is a treasure trove for anyone engaged in localization, cultural exploration, or linguistic curiosity, offering a passport to embark on a global journey through languages and dialects.

By invoking `getAllLocales`, you gain access to an extensive map detailing the array of locales for each country. It’s like unlocking a global directory, where every entry points to a unique cultural and linguistic setting 🗺️📖. This functionality enables developers and content creators to tailor experiences that resonate on a personal level with users worldwide, fostering inclusivity and understanding across borders.

#### Example Usage

```javascript
// Retrieve all locales for every country
const allLocales = getAllLocales();
console.log(allLocales); // Outputs a comprehensive list: { AE: ['ar_AE', 'en_AE'], AL: ['sq_AL'], ... }

// Exploring locales for United Arab Emirates
console.log(allLocales.AE); // Outputs ['ar_AE', 'en_AE']

// Checking out the locales for Albania
console.log(allLocales.AL); // Outputs ['sq_AL']
```

Utilizing `getAllLocales` in your projects opens up a world of possibilities, allowing you to navigate through the rich and varied linguistic landscape of our planet 🌍💡. It serves not just as a tool for technical implementation, but as a bridge connecting the myriad cultures and languages that enrich our global village.

### getDefaultLocaleByCountry(countryCode)

The `getDefaultLocaleByCountry` function 🌍🔧 is an essential utility designed for applications requiring localization precision. It maps a given ISO country code to its corresponding default locale, facilitating a culturally accurate and linguistically tailored user experience. This function serves as a crucial component in internationalizing applications, ensuring that content is presented in the most appropriate language and format based on the user's geographic location.

By accepting a country code as its single argument, this function delivers the default locale, embodying the primary language or dialect spoken within that territory 🗣️🌐. This enables developers to automatically adjust the language settings of their application or website, promoting accessibility and enhancing user engagement across diverse cultural contexts.

#### Example Usage

```javascript
// Retrieving the default locale for Germany
const germanyLocale = getDefaultLocaleByCountry('DE');
console.log(germanyLocale); // Outputs 'de-DE'

// Retrieving the default locale for Brazil
const brazilLocale = getDefaultLocaleByCountry('BR');
console.log(brazilLocale); // Outputs 'pt-BR'
```

Incorporating `getDefaultLocaleByCountry` into your development process empowers you to craft applications that not only function globally 🌎💼 but also communicate effectively and respectfully with users worldwide 🗣️❤️, acknowledging and adapting to the rich tapestry of global cultures and languages.

#### getLocalesByCountry(countryCode)

🧭 Locale Explorer. Set sail on a linguistic expedition with getLocalesByCountry! This function is your compass, pointing to all the locales a country embraces. Whether you're tailoring content for the cosmopolitan cities of Canada or the traditional towns of Tanzania, this function ensures you have the full list of linguistic lanes to traverse. It's not just a function; it's your passport to personalization and precision. 🛤️✨

##### Examples

```javascript
// Retrieve locales for Canada
const canadaLocales = getLocalesByCountry('CA');
console.log(canadaLocales); // ['en_CA', 'fr_CA', ...]

// Retrieve locales for Tanzania
const tanzaniaLocales = getLocalesByCountry('TZ');
console.log(tanzaniaLocales); // ['sw_TZ', 'en_TZ']
```

With getLocalesByCountry, your application doesn't just speak languages; it speaks cultures. Navigate the nuances of localization and give your users a home feeling, no matter where they are. 🌍🔍

#### getDefaultLocales()

🌐 This powerhouse function is like the United Nations of locales, bringing together a world of country codes and their corresponding default locales. It's simple: call it, and you get an object packed with every country code linked to its default locale. From 'IN' to 'MY', and beyond, gearing up your app to go global has never been easier! 🌍✨

##### Examples

```javascript
// Retrieve default locales for all countries
const locales = getDefaultLocales();
console.log(locales); // { IN: 'en-IN', MY: 'ms-MY', ... }

// Accessing the default locale for India
console.log(locales.IN); // 'en-IN'

// Accessing the default locale for Malaysia
console.log(locales.MY); // 'ms-MY'
```

With this module, localizing your application is straightforward and efficient. It's like having a world map of languages and cultures right at your fingertips. Dive in and give your users the local touch they deserve! 🌐✨

### getLocale()

The `getLocale` function 🌍🔧 is a sleek and intelligent utility crafted to seamlessly identify and retrieve the user's current locale setting. Whether your application is scaling the digital heights of global markets or fine-tuning the nuances of local user experiences, `getLocale` serves as your navigator through the intricate web of regional language settings. This function is invaluable for developers aiming to create applications that adapt dynamically to the user's linguistic and cultural environment, offering a personalized touch right from the start.

#### Example

```javascript
// Dynamically retrieve the user's current locale

const userLocale = getLocale();

console.log(userLocale); // Outputs the detected locale, e.g., 'en-US' for a user in the United States

// Example in a non-browser or unsupported environment

// The output defaults to 'en-IN', ensuring broad compatibility

const defaultLocale = getLocale();

console.log(defaultLocale); // Outputs 'en-IN'
```

Employing `getLocale` in your development toolkit opens doors to a world where applications are not just globally aware but also culturally connected. It ensures that every user interaction is informed by linguistic precision and cultural empathy, paving the way for truly globalized digital experiences. 🌐💼

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
