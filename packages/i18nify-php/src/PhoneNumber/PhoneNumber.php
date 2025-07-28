<?php

namespace Razorpay\I18nify\PhoneNumber;

use Razorpay\I18nify\Utils\DataLoader;

/**
 * PhoneNumber utility class for handling phone number operations
 */
class PhoneNumber
{
    private static ?array $countryToPhoneData = null;
    private static ?array $dialCodeToCountryData = null;

    /**
     * Get all country telephone information
     */
    public static function getAllCountryPhoneData(): array
    {
        if (self::$countryToPhoneData === null) {
            $data = DataLoader::loadData('phone-number/country-code-to-phone-number/data.json');
            self::$countryToPhoneData = $data['country_tele_information'] ?? [];
        }
        
        return self::$countryToPhoneData;
    }

    /**
     * Get dial code to country mapping
     */
    public static function getDialCodeToCountryData(): array
    {
        if (self::$dialCodeToCountryData === null) {
            $data = DataLoader::loadData('phone-number/dial-code-to-country/data.json');
            self::$dialCodeToCountryData = $data['dial_code_to_country'] ?? [];
        }
        
        return self::$dialCodeToCountryData;
    }

    /**
     * Get phone number information for a country
     */
    public static function getPhoneNumberInfo(string $countryCode): ?array
    {
        $phoneData = self::getAllCountryPhoneData();
        $countryCode = strtoupper($countryCode);
        
        return $phoneData[$countryCode] ?? null;
    }

    /**
     * Get dial code for a country
     */
    public static function getDialCode(string $countryCode): ?string
    {
        $phoneInfo = self::getPhoneNumberInfo($countryCode);
        return $phoneInfo['dial_code'] ?? null;
    }

    /**
     * Get phone number format for a country
     */
    public static function getPhoneNumberFormat(string $countryCode): ?string
    {
        $phoneInfo = self::getPhoneNumberInfo($countryCode);
        return $phoneInfo['format'] ?? null;
    }

    /**
     * Get phone number regex pattern for a country
     */
    public static function getPhoneNumberRegex(string $countryCode): ?string
    {
        $phoneInfo = self::getPhoneNumberInfo($countryCode);
        return $phoneInfo['regex'] ?? null;
    }

    /**
     * Validate phone number for a specific country
     */
    public static function validatePhoneNumber(string $phoneNumber, string $countryCode): bool
    {
        $regex = self::getPhoneNumberRegex($countryCode);
        if (!$regex) {
            return false;
        }
        
        // Remove any non-digit characters except +
        $cleanNumber = preg_replace('/[^\d+]/', '', $phoneNumber);
        if ($cleanNumber === null) {
            return false;
        }
        
        // Remove country dial code if present
        $dialCode = self::getDialCode($countryCode);
        if ($dialCode && strpos($cleanNumber, $dialCode) === 0) {
            $cleanNumber = substr($cleanNumber, strlen($dialCode));
        } elseif (strpos($cleanNumber, '+') === 0) {
            $cleanNumber = ltrim($cleanNumber, '+');
            // Remove the numeric part of dial code
            $numericDialCode = $dialCode ? ltrim($dialCode, '+') : '';
            if ($numericDialCode !== '' && strpos($cleanNumber, $numericDialCode) === 0) {
                $cleanNumber = substr($cleanNumber, strlen($numericDialCode));
            }
        }
        
        return preg_match('/^' . $regex . '$/', $cleanNumber) === 1;
    }

    /**
     * Format phone number according to country format
     */
    public static function formatPhoneNumber(string $phoneNumber, string $countryCode): ?string
    {
        if (!self::validatePhoneNumber($phoneNumber, $countryCode)) {
            return null;
        }
        
        $format = self::getPhoneNumberFormat($countryCode);
        $dialCode = self::getDialCode($countryCode);
        
        if (!$format || !$dialCode) {
            return null;
        }
        
        // Clean the number
        $cleanNumber = preg_replace('/[^\d]/', '', $phoneNumber);
        if ($cleanNumber === null) {
            return null;
        }
        
        // Remove country code if present
        $numericDialCode = ltrim($dialCode, '+');
        if (strpos($cleanNumber, $numericDialCode) === 0) {
            $cleanNumber = substr($cleanNumber, strlen($numericDialCode));
        }
        
        // Apply format
        $formatted = $format;
        for ($i = 0; $i < strlen($cleanNumber); $i++) {
            $pos = strpos($formatted, 'x');
            if ($pos !== false && isset($cleanNumber[$i])) {
                $formatted = substr_replace($formatted, $cleanNumber[$i], $pos, 1);
            }
        }
        
        // Remove any remaining 'x' characters
        $formatted = str_replace('x', '', $formatted);
        
        return $dialCode . ' ' . trim($formatted);
    }

    /**
     * Get countries by dial code
     */
    public static function getCountriesByDialCode(string $dialCode): array
    {
        $dialCodeData = self::getDialCodeToCountryData();
        $dialCode = ltrim($dialCode, '+');
        
        return $dialCodeData[$dialCode] ?? [];
    }

    /**
     * Get dial code from phone number
     */
    public static function extractDialCode(string $phoneNumber): ?string
    {
        $dialCodeData = self::getDialCodeToCountryData();
        $cleanNumber = preg_replace('/[^\d]/', '', $phoneNumber);
        
        if ($cleanNumber === null) {
            return null;
        }
        
        // Try to match dial codes from longest to shortest
        $dialCodes = array_keys($dialCodeData);
        usort($dialCodes, function($a, $b) {
            return strlen($b) - strlen($a);
        });
        
        foreach ($dialCodes as $dialCode) {
            if (strpos($cleanNumber, $dialCode) === 0) {
                return '+' . $dialCode;
            }
        }
        
        return null;
    }

    /**
     * Detect country from phone number
     */
    public static function detectCountryFromPhoneNumber(string $phoneNumber): array
    {
        $dialCode = self::extractDialCode($phoneNumber);
        if (!$dialCode) {
            return [];
        }
        
        return self::getCountriesByDialCode($dialCode);
    }

    /**
     * Check if phone number is valid for any country
     */
    public static function isValidPhoneNumber(string $phoneNumber): bool
    {
        $countries = self::detectCountryFromPhoneNumber($phoneNumber);
        
        foreach ($countries as $countryCode) {
            if (self::validatePhoneNumber($phoneNumber, $countryCode)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get all dial codes
     */
    public static function getAllDialCodes(): array
    {
        $dialCodeData = self::getDialCodeToCountryData();
        return array_map(function($code) {
            return '+' . $code;
        }, array_keys($dialCodeData));
    }
}
