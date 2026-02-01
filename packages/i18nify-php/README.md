# i18nify-php

PHP SDK for i18nify - A comprehensive internationalization library for handling countries, currencies, phone numbers, bank codes, and more.

## Installation

### Using Composer

```bash
composer require razorpay/i18nify-php
```

### Manual Installation

1. Download the source code
2. Include the autoloader in your project:

```php
require_once 'vendor/autoload.php';
```

## Requirements

- PHP 7.4 or higher
- ext-json extension

## Quick Start

```php
<?php

use Razorpay\I18nify\I18nify;

// Initialize the library (optional - uses default data path)
I18nify::init();

// Get country information
$countryInfo = I18nify::getCountryInfo('US');
echo $countryInfo['country_name']; // United States

// Validate and format phone numbers
$isValid = I18nify::validatePhoneNumber('+1-555-123-4567', 'US');
$formatted = I18nify::formatPhoneNumber('5551234567', 'US');

// Currency operations
$currencyInfo = I18nify::getCurrencyInfo('USD');
$formatted = I18nify::formatCurrency(1234.56, 'USD');

// Bank code validation
$isValid = I18nify::validateBankIdentifier('IN', 'HDFC0000123', 'IFSC');
```

## Features

### Country Operations

```php
use Razorpay\I18nify\Country\Country;

// Get all countries
$allCountries = Country::getAllCountries();

// Get country information
$countryInfo = Country::getCountryInfo('IN');

// Get country name
$name = Country::getCountryName('IN'); // India

// Get dial code
$dialCode = Country::getDialCode('IN'); // +91

// Get flag URL
$flagUrl = Country::getFlagUrl('IN');

// Get supported currencies
$currencies = Country::getSupportedCurrencies('IN'); // ['INR']

// Get default currency
$defaultCurrency = Country::getDefaultCurrency('IN'); // INR

// Get timezones
$timezones = Country::getTimezones('IN');

// Get locales
$locales = Country::getLocales('IN');

// Get continent information
$continent = Country::getContinentInfo('IN');
// ['continent_code' => 'AS', 'continent_name' => 'Asia']

// Validate country code
$isValid = Country::isValidCountryCode('IN'); // true

// Get countries by continent
$asianCountries = Country::getCountriesByContinent('AS');

// Search countries by name
$countries = Country::searchCountriesByName('India');

// Get subdivisions (states/provinces)
$subdivisions = Country::getSubdivisions('IN');

// Check if subdivisions exist
$hasSubdivisions = Country::hasSubdivisions('IN'); // true
```

### Currency Operations

```php
use Razorpay\I18nify\Currency\Currency;

// Get all currencies
$allCurrencies = Currency::getAllCurrencies();

// Get currency information
$currencyInfo = Currency::getCurrencyInfo('USD');

// Get currency name
$name = Currency::getCurrencyName('USD'); // US Dollar

// Get currency symbol
$symbol = Currency::getCurrencySymbol('USD'); // $

// Get minor units (decimal places)
$minorUnits = Currency::getMinorUnits('USD'); // 2

// Validate currency code
$isValid = Currency::isValidCurrencyCode('USD'); // true

// Format currency
$formatted = Currency::formatCurrency(1234.56, 'USD'); // $1,234.56
$formatted = Currency::formatCurrency(1234.56, 'USD', 'en_US'); // With locale

// Convert to/from minor units
$cents = Currency::toMinorUnits(12.34, 'USD'); // 1234
$dollars = Currency::fromMinorUnits(1234, 'USD'); // 12.34

// Get all currency codes
$codes = Currency::getAllCurrencyCodes();

// Search currencies
$currencies = Currency::searchCurrenciesByName('Dollar');

// Get currency display info
$display = Currency::getCurrencyDisplay('USD');
// ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$', 'minor_units' => 2]
```

### Phone Number Operations

```php
use Razorpay\I18nify\PhoneNumber\PhoneNumber;

// Get phone number information for a country
$phoneInfo = PhoneNumber::getPhoneNumberInfo('US');

// Get dial code
$dialCode = PhoneNumber::getDialCode('US'); // +1

// Get phone number format
$format = PhoneNumber::getPhoneNumberFormat('US'); // xxx-xxxx

// Get regex pattern
$regex = PhoneNumber::getPhoneNumberRegex('US');

// Validate phone number for specific country
$isValid = PhoneNumber::validatePhoneNumber('+1-555-123-4567', 'US');

// Format phone number
$formatted = PhoneNumber::formatPhoneNumber('5551234567', 'US');
// +1 555-1234567

// Get countries by dial code
$countries = PhoneNumber::getCountriesByDialCode('+1');
// ['US', 'CA', 'AG', ...]

// Extract dial code from phone number
$dialCode = PhoneNumber::extractDialCode('+1-555-123-4567'); // +1

// Detect country from phone number
$countries = PhoneNumber::detectCountryFromPhoneNumber('+1-555-123-4567');

// Check if phone number is valid for any country
$isValid = PhoneNumber::isValidPhoneNumber('+1-555-123-4567');

// Get all dial codes
$allDialCodes = PhoneNumber::getAllDialCodes();
```

### Bank Code Operations

```php
use Razorpay\I18nify\BankCode\BankCode;

// Get default identifier type for a country
$identifierType = BankCode::getDefaultIdentifierType('IN'); // IFSC

// Get all banks for a country
$banks = BankCode::getAllBanks('IN');

// Search bank by name
$banks = BankCode::searchBankByName('IN', 'HDFC');

// Get bank by short code
$bank = BankCode::getBankByShortCode('IN', 'HDFC');

// Get bank branches
$branches = BankCode::getBankBranches('IN', 'HDFC');

// Search branch by code
$branches = BankCode::searchBranchByCode('IN', '001234');

// Search branches by city
$branches = BankCode::searchBranchesByCity('IN', 'Mumbai');

// Validate bank identifier
$isValid = BankCode::validateBankIdentifier('IN', 'HDFC0001234', 'IFSC');

// Validate specific identifier types
$isValidIFSC = BankCode::validateIFSC('HDFC0001234');
$isValidSWIFT = BankCode::validateSWIFT('HDFCINBB');
$isValidRouting = BankCode::validateRoutingNumber('021000021');

// Get branch by identifier
$branch = BankCode::getBranchByIdentifier('IN', 'HDFC0001234', 'IFSC');

// Check if bank codes are available for a country
$hasBankCodes = BankCode::hasBankCodes('IN'); // true
```

## Data Customization

You can specify a custom path to the i18nify-data directory:

```php
use Razorpay\I18nify\I18nify;

// Initialize with custom data path
I18nify::init('/path/to/custom/i18nify-data');

// Or set it directly on the DataLoader
use Razorpay\I18nify\Utils\DataLoader;
DataLoader::setDataPath('/path/to/custom/i18nify-data');
```

## Error Handling

The library throws `RuntimeException` for data loading errors:

```php
try {
    $countryInfo = Country::getCountryInfo('INVALID');
} catch (\RuntimeException $e) {
    echo "Error: " . $e->getMessage();
}
```

## Performance Considerations

- Data is automatically cached after first load
- Use `DataLoader::clearCache()` to clear the cache if needed
- For high-performance applications, consider implementing your own caching layer

## Available Countries

The library supports all countries with ISO 3166-1 alpha-2 codes. Some countries also have subdivision data available.

Countries with subdivision data:
- IN (India)
- US (United States)
- MY (Malaysia)
- SG (Singapore)

Countries with bank code data:
- IN (India) - IFSC codes
- US (United States) - Routing numbers
- MY (Malaysia)
- SG (Singapore) - SWIFT codes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## Testing

```bash
# Run tests
composer test

# Run static analysis
composer phpstan

# Check code style
composer phpcs

# Fix code style
composer phpcbf
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review existing issues for solutions

## Changelog

### 1.0.0
- Initial release
- Country metadata support
- Currency operations
- Phone number validation and formatting
- Bank code validation
- Subdivision support for select countries
