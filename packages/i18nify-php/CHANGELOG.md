# Changelog

All notable changes to the i18nify PHP SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - TBD

### Added
- Initial release of i18nify PHP SDK
- Country metadata operations (name, dial code, flag, currency, timezones, locales)
- Currency information and formatting utilities
- Phone number validation and formatting
- Bank code validation (IFSC, SWIFT, routing numbers)
- Subdivision support for select countries
- Comprehensive data loading utilities
- PSR-4 autoloading compliance
- Full test suite with PHPUnit
- Static analysis with PHPStan
- Code style enforcement with PHP_CodeSniffer
- Comprehensive documentation and examples

### Country Features
- Get country information by ISO 3166-1 alpha-2 codes
- Country validation and search functionality
- Continent-based country filtering
- Support for country subdivisions (states/provinces)
- Timezone and locale information

### Currency Features
- Currency information retrieval and validation
- Amount formatting with proper symbols and decimal places
- Minor units conversion (dollars ↔ cents)
- Multi-locale currency formatting support
- Currency search capabilities

### Phone Number Features
- Country-specific phone number validation
- Phone number formatting according to country patterns
- Dial code extraction and country detection
- International phone number support
- Comprehensive regex-based validation

### Bank Code Features
- IFSC code validation for India
- SWIFT code validation for international banks
- US routing number validation with checksum
- Bank and branch search functionality
- Support for multiple identifier types per country

### Technical Features
- Automatic JSON data caching for performance
- Custom data path configuration
- Comprehensive error handling with descriptive messages
- PSR-12 coding standards compliance
- 100% test coverage goal
- Extensive documentation and usage examples
