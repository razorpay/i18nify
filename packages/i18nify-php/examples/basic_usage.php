<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Razorpay\I18nify\I18nify;

// Initialize the library
I18nify::init();

echo "=== i18nify-php Examples ===\n\n";

// Country examples
echo "=== Country Operations ===\n";
$countryInfo = I18nify::getCountryInfo('IN');
echo "Country: " . ($countryInfo['country_name'] ?? 'Unknown') . "\n";
echo "Dial Code: " . I18nify::getDialCode('IN') . "\n";
echo "Default Currency: " . ($countryInfo['default_currency'] ?? 'Unknown') . "\n";
echo "Is valid country code 'IN': " . (I18nify::isValidCountryCode('IN') ? 'Yes' : 'No') . "\n\n";

// Currency examples
echo "=== Currency Operations ===\n";
$currencyInfo = I18nify::getCurrencyInfo('USD');
echo "Currency: " . ($currencyInfo['currency_name'] ?? 'Unknown') . "\n";
echo "Symbol: " . ($currencyInfo['symbol'] ?? 'Unknown') . "\n";
echo "Formatted: " . I18nify::formatCurrency(1234.56, 'USD') . "\n";
echo "Is valid currency code 'USD': " . (I18nify::isValidCurrencyCode('USD') ? 'Yes' : 'No') . "\n\n";

// Phone number examples
echo "=== Phone Number Operations ===\n";
$phoneNumber = '+1-555-123-4567';
echo "Phone Number: {$phoneNumber}\n";
echo "Is valid for US: " . (I18nify::validatePhoneNumber($phoneNumber, 'US') ? 'Yes' : 'No') . "\n";
$formatted = I18nify::formatPhoneNumber('5551234567', 'US');
echo "Formatted: " . ($formatted ?? 'Invalid') . "\n";
$detectedCountries = I18nify::detectCountryFromPhoneNumber($phoneNumber);
echo "Detected countries: " . implode(', ', $detectedCountries) . "\n\n";

// Bank code examples
echo "=== Bank Code Operations ===\n";
$bankIdentifier = 'HDFC0000123';
echo "Bank Identifier: {$bankIdentifier}\n";
echo "Is valid IFSC for IN: " . (I18nify::validateBankIdentifier('IN', $bankIdentifier, 'IFSC') ? 'Yes' : 'No') . "\n\n";

echo "=== Library Info ===\n";
echo "Version: " . I18nify::getVersion() . "\n";
