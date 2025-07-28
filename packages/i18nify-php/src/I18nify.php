<?php

namespace Razorpay\I18nify;

use Razorpay\I18nify\Country\Country;
use Razorpay\I18nify\Currency\Currency;
use Razorpay\I18nify\PhoneNumber\PhoneNumber;
use Razorpay\I18nify\BankCode\BankCode;
use Razorpay\I18nify\Utils\DataLoader;

/**
 * Main I18nify class - Entry point for the i18nify PHP SDK
 */
class I18nify
{
    /**
     * Initialize the i18nify library with custom data path
     */
    public static function init(?string $dataPath = null): void
    {
        DataLoader::init($dataPath);
    }

    /**
     * Country utilities
     */
    public static function country(): Country
    {
        return new Country();
    }

    /**
     * Currency utilities
     */
    public static function currency(): Currency
    {
        return new Currency();
    }

    /**
     * Phone number utilities
     */
    public static function phoneNumber(): PhoneNumber
    {
        return new PhoneNumber();
    }

    /**
     * Bank code utilities
     */
    public static function bankCode(): BankCode
    {
        return new BankCode();
    }

    /**
     * Quick access methods for common operations
     */
    
    /**
     * Get country information
     */
    public static function getCountryInfo(string $countryCode): ?array
    {
        return Country::getCountryInfo($countryCode);
    }

    /**
     * Get currency information
     */
    public static function getCurrencyInfo(string $currencyCode): ?array
    {
        return Currency::getCurrencyInfo($currencyCode);
    }

    /**
     * Validate phone number
     */
    public static function validatePhoneNumber(string $phoneNumber, string $countryCode): bool
    {
        return PhoneNumber::validatePhoneNumber($phoneNumber, $countryCode);
    }

    /**
     * Format phone number
     */
    public static function formatPhoneNumber(string $phoneNumber, string $countryCode): ?string
    {
        return PhoneNumber::formatPhoneNumber($phoneNumber, $countryCode);
    }

    /**
     * Format currency
     */
    public static function formatCurrency(float $amount, string $currencyCode, ?string $locale = null): string
    {
        return Currency::formatCurrency($amount, $currencyCode, $locale);
    }

    /**
     * Validate bank identifier
     */
    public static function validateBankIdentifier(string $countryCode, string $identifier, ?string $type = null): bool
    {
        return BankCode::validateBankIdentifier($countryCode, $identifier, $type);
    }

    /**
     * Get dial code for country
     */
    public static function getDialCode(string $countryCode): ?string
    {
        return Country::getDialCode($countryCode);
    }

    /**
     * Check if country code is valid
     */
    public static function isValidCountryCode(string $countryCode): bool
    {
        return Country::isValidCountryCode($countryCode);
    }

    /**
     * Check if currency code is valid
     */
    public static function isValidCurrencyCode(string $currencyCode): bool
    {
        return Currency::isValidCurrencyCode($currencyCode);
    }

    /**
     * Detect country from phone number
     */
    public static function detectCountryFromPhoneNumber(string $phoneNumber): array
    {
        return PhoneNumber::detectCountryFromPhoneNumber($phoneNumber);
    }

    /**
     * Get supported currencies for a country
     */
    public static function getSupportedCurrencies(string $countryCode): array
    {
        return Country::getSupportedCurrencies($countryCode);
    }

    /**
     * Get version information
     */
    public static function getVersion(): string
    {
        return '1.0.0';
    }
}
