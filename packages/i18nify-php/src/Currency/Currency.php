<?php

namespace Razorpay\I18nify\Currency;

use Razorpay\I18nify\Utils\DataLoader;

/**
 * Currency utility class for handling currency information and operations
 */
class Currency
{
    private static ?array $currencyData = null;

    /**
     * Get all currency information
     */
    public static function getAllCurrencies(): array
    {
        if (self::$currencyData === null) {
            $data = DataLoader::loadData('currency/data.json');
            self::$currencyData = $data['currency_information'] ?? [];
        }
        
        return self::$currencyData;
    }

    /**
     * Get currency information by currency code
     */
    public static function getCurrencyInfo(string $currencyCode): ?array
    {
        $currencies = self::getAllCurrencies();
        $currencyCode = strtoupper($currencyCode);
        
        return $currencies[$currencyCode] ?? null;
    }

    /**
     * Get currency name by currency code
     */
    public static function getCurrencyName(string $currencyCode): ?string
    {
        $currencyInfo = self::getCurrencyInfo($currencyCode);
        return $currencyInfo['name'] ?? null;
    }

    /**
     * Get currency symbol by currency code
     */
    public static function getCurrencySymbol(string $currencyCode): ?string
    {
        $currencyInfo = self::getCurrencyInfo($currencyCode);
        return $currencyInfo['symbol'] ?? null;
    }

    /**
     * Get currency minor units (decimal places)
     */
    public static function getMinorUnits(string $currencyCode): ?int
    {
        $currencyInfo = self::getCurrencyInfo($currencyCode);
        return isset($currencyInfo['minor_unit']) ? (int)$currencyInfo['minor_unit'] : null;
    }

    /**
     * Check if a currency code is valid
     */
    public static function isValidCurrencyCode(string $currencyCode): bool
    {
        $currencies = self::getAllCurrencies();
        return isset($currencies[strtoupper($currencyCode)]);
    }

    /**
     * Format currency amount with proper symbol and decimal places
     */
    public static function formatCurrency(float $amount, string $currencyCode, ?string $locale = null): string
    {
        $currencyInfo = self::getCurrencyInfo($currencyCode);
        if (!$currencyInfo) {
            return number_format($amount, 2) . ' ' . $currencyCode;
        }

        $minorUnits = self::getMinorUnits($currencyCode) ?? 2;
        $symbol = self::getCurrencySymbol($currencyCode) ?? $currencyCode;
        
        if ($locale && class_exists('NumberFormatter')) {
            $formatter = new \NumberFormatter($locale, \NumberFormatter::CURRENCY);
            $formatted = $formatter->formatCurrency($amount, $currencyCode);
            return $formatted !== false ? $formatted : $symbol . number_format($amount, $minorUnits);
        }
        
        return $symbol . number_format($amount, $minorUnits);
    }

    /**
     * Convert amount to minor units (e.g., dollars to cents)
     */
    public static function toMinorUnits(float $amount, string $currencyCode): int
    {
        $minorUnits = self::getMinorUnits($currencyCode) ?? 2;
        return (int)round($amount * pow(10, $minorUnits));
    }

    /**
     * Convert amount from minor units (e.g., cents to dollars)
     */
    public static function fromMinorUnits(int $amount, string $currencyCode): float
    {
        $minorUnits = self::getMinorUnits($currencyCode) ?? 2;
        return $amount / pow(10, $minorUnits);
    }

    /**
     * Get all currency codes
     */
    public static function getAllCurrencyCodes(): array
    {
        return array_keys(self::getAllCurrencies());
    }

    /**
     * Search currencies by name
     */
    public static function searchCurrenciesByName(string $searchTerm): array
    {
        $currencies = self::getAllCurrencies();
        $result = [];
        $searchTerm = strtolower($searchTerm);
        
        foreach ($currencies as $code => $info) {
            if (isset($info['name']) && 
                strpos(strtolower($info['name']), $searchTerm) !== false) {
                $result[$code] = $info;
            }
        }
        
        return $result;
    }

    /**
     * Get currency display information for UI
     */
    public static function getCurrencyDisplay(string $currencyCode): array
    {
        $currencyInfo = self::getCurrencyInfo($currencyCode);
        if (!$currencyInfo) {
            return [];
        }
        
        return [
            'code' => strtoupper($currencyCode),
            'name' => $currencyInfo['name'] ?? '',
            'symbol' => $currencyInfo['symbol'] ?? $currencyCode,
            'minor_units' => $currencyInfo['minor_unit'] ?? 2,
        ];
    }
}
