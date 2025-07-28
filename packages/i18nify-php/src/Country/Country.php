<?php

namespace Razorpay\I18nify\Country;

use Razorpay\I18nify\Utils\DataLoader;

/**
 * Country utility class for handling country metadata and operations
 */
class Country
{
    private static ?array $countryData = null;
    private static ?array $subdivisionData = null;

    /**
     * Get all country metadata
     */
    public static function getAllCountries(): array
    {
        if (self::$countryData === null) {
            $data = DataLoader::loadData('country/metadata/data.json');
            self::$countryData = $data['metadata_information'] ?? [];
        }
        
        return self::$countryData;
    }

    /**
     * Get country information by country code
     */
    public static function getCountryInfo(string $countryCode): ?array
    {
        $countries = self::getAllCountries();
        $countryCode = strtoupper($countryCode);
        
        return $countries[$countryCode] ?? null;
    }

    /**
     * Get country name by country code
     */
    public static function getCountryName(string $countryCode): ?string
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['country_name'] ?? null;
    }

    /**
     * Get country dial code
     */
    public static function getDialCode(string $countryCode): ?string
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['dial_code'] ?? null;
    }

    /**
     * Get country flag URL
     */
    public static function getFlagUrl(string $countryCode): ?string
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['flag'] ?? null;
    }

    /**
     * Get supported currencies for a country
     */
    public static function getSupportedCurrencies(string $countryCode): array
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['supportedCurrency'] ?? [];
    }

    /**
     * Get default currency for a country
     */
    public static function getDefaultCurrency(string $countryCode): ?string
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['default_currency'] ?? null;
    }

    /**
     * Get timezones for a country
     */
    public static function getTimezones(string $countryCode): array
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['timezones'] ?? [];
    }

    /**
     * Get default locale for a country
     */
    public static function getDefaultLocale(string $countryCode): ?string
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['default_locale'] ?? null;
    }

    /**
     * Get locales for a country
     */
    public static function getLocales(string $countryCode): array
    {
        $countryInfo = self::getCountryInfo($countryCode);
        return $countryInfo['locales'] ?? [];
    }

    /**
     * Get continent information for a country
     */
    public static function getContinentInfo(string $countryCode): array
    {
        $countryInfo = self::getCountryInfo($countryCode);
        if (!$countryInfo) {
            return [];
        }
        
        return [
            'continent_code' => $countryInfo['continent_code'] ?? null,
            'continent_name' => $countryInfo['continent_name'] ?? null,
        ];
    }

    /**
     * Check if a country code is valid
     */
    public static function isValidCountryCode(string $countryCode): bool
    {
        $countries = self::getAllCountries();
        return isset($countries[strtoupper($countryCode)]);
    }

    /**
     * Get countries by continent code
     */
    public static function getCountriesByContinent(string $continentCode): array
    {
        $countries = self::getAllCountries();
        $result = [];
        
        foreach ($countries as $code => $info) {
            if (isset($info['continent_code']) && 
                strtoupper($info['continent_code']) === strtoupper($continentCode)) {
                $result[$code] = $info;
            }
        }
        
        return $result;
    }

    /**
     * Search countries by name
     */
    public static function searchCountriesByName(string $searchTerm): array
    {
        $countries = self::getAllCountries();
        $result = [];
        $searchTerm = strtolower($searchTerm);
        
        foreach ($countries as $code => $info) {
            if (isset($info['country_name']) && 
                strpos(strtolower($info['country_name']), $searchTerm) !== false) {
                $result[$code] = $info;
            }
        }
        
        return $result;
    }

    /**
     * Get subdivisions for a country
     */
    public static function getSubdivisions(string $countryCode): array
    {
        $countryCode = strtoupper($countryCode);
        
        try {
            $data = DataLoader::loadData("country/subdivisions/{$countryCode}.json");
            return $data['subdivision_information'] ?? [];
        } catch (\RuntimeException $e) {
            // Country subdivision file doesn't exist
            return [];
        }
    }

    /**
     * Check if subdivisions exist for a country
     */
    public static function hasSubdivisions(string $countryCode): bool
    {
        return !empty(self::getSubdivisions($countryCode));
    }
}
