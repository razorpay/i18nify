# @razorpay/i18nify-js

## 1.9.3

### Patch Changes

- 7321238: feat: refactoring currency module to use central geo data

## 1.9.2

### Patch Changes

- 891908b: Singapore validation bug fixed

## 1.9.1

### Patch Changes

- eb5a756: [fix]: singapore validation regex fixed
- 5083738: fix: text should be treated inValid in isValidPhoneNumber [ATLAS-196]

## 1.9.0

### Minor Changes

- 472f8aa: Feat: Geo-contextual module

### Patch Changes

- 774d07b: Feat: static configs in phone module replaced with i18nify-data
- 3f406fb: Feat: Added an alias of i18nify-data to allow static imports of json within js package
- Feat: Phone number engine modified (dialcode or countryCode treated as mandatory)

## 1.8.1

### Patch Changes

- c7c88c4: [chore]: new currency codes added

## 1.8.0

### Minor Changes

- 33a66ca: Flag service updated to return unpkg url

## 1.7.0

### Minor Changes

- 05e4574: Flags deployed on unpkg

## 1.6.1

### Patch Changes

- 6980dba: fix: update country code data for phone number and currency module

## 1.6.0

### Minor Changes

- 77e9bf7: feat[ATLAS-104]: Introducing Date & Time Module

## 1.5.0

### Minor Changes

- 92bbe13: feat: Add new Geo module - Country Flag SVG's

## 1.4.4

### Patch Changes

- 1d758b7: fix: submodules added in published files in package.json

## 1.4.3

### Patch Changes

- a5b362e: [fix]: sub-module files generated at root and imports fixed for react native

## 1.4.2

### Patch Changes

- c82bd92: [feat]: Add dial codes apis in phoneNumber module

## 1.4.1

### Patch Changes

- 7f8b698: fix: getting empty dialCode in parsePhoneNumber even after getting countryCode

## 1.4.0

### Minor Changes

- 5c6b356: [feat]: shared chunk created for common modules in esm

## 1.3.1

### Patch Changes

- 41852b9: [feat]: add major/minor conversion apis in currency module

## 1.3.0

### Minor Changes

- bb2a1d7: [fix]: generic type from CURRENCIES list removed

## 1.2.0

### Minor Changes

- 8154f6c: Feat: Mono-repo setup added for i18nify and i18nify plugins

## 1.1.0

### Minor Changes

- 61774b3: feat: API contract for formatNumberByParts updated

## 1.3.0

### Minor Changes

- 665a9cc: [feat]: playwright setup added for cross browser testing

### Patch Changes

- 8a6c15b: [fix]: circular dependency fixed

## 1.2.3

### Patch Changes

- 562b692: fix : #36 corrected getLocal function.

## 1.2.2

### Patch Changes

- 45ef401: [fix]:
  - redundant token removed from coverage workflow
  - cjs exports added for sub-modules

## 1.2.1

### Patch Changes

- 3d3c1c8: [feat]: resetState function exposed to consumers

## 1.2.0

### Minor Changes

- b381506: Publish phone number module

## 1.1.0

### Minor Changes

- b0fcee0: [feat]:
  1. Introduced StateManager, getters and setters to handle i18n global state
  2. added support for sub-module import(@razorpay/i18nify-js/currency, @razorpay/i18nify-js/phoneNumber)

## 1.0.3

### Patch Changes

- 1e1b8d8: [fix]: redundant types deleted

## 1.0.2

### Patch Changes

- f1cbf58: public access added at npm publish

## 1.0.1

### Patch Changes

- 26b54ee: Fixing release bugs
