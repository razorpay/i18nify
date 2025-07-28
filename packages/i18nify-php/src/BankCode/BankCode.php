<?php

namespace Razorpay\I18nify\BankCode;

use Razorpay\I18nify\Utils\DataLoader;

/**
 * BankCode utility class for handling bank code information and operations
 */
class BankCode
{
    private static array $bankDataCache = [];

    /**
     * Get bank code data for a specific country
     */
    public static function getBankCodeData(string $countryCode): array
    {
        $countryCode = strtoupper($countryCode);

        if (isset(self::$bankDataCache[$countryCode])) {
            return self::$bankDataCache[$countryCode];
        }

        try {
            $data = DataLoader::loadData("bankcodes/{$countryCode}.json");
            self::$bankDataCache[$countryCode] = $data;
            return $data;
        } catch (\RuntimeException $e) {
            // Country bank code file doesn't exist
            self::$bankDataCache[$countryCode] = [];
            return [];
        }
    }

    /**
     * Get default identifier type for a country
     */
    public static function getDefaultIdentifierType(string $countryCode): ?string
    {
        $bankData = self::getBankCodeData($countryCode);
        return $bankData['defaults']['identifier_type'] ?? null;
    }

    /**
     * Get all banks for a country
     */
    public static function getAllBanks(string $countryCode): array
    {
        $bankData = self::getBankCodeData($countryCode);
        return $bankData['details'] ?? [];
    }

    /**
     * Search bank by name
     */
    public static function searchBankByName(string $countryCode, string $bankName): array
    {
        $banks = self::getAllBanks($countryCode);
        $result = [];
        $searchTerm = strtolower($bankName);

        foreach ($banks as $bank) {
            $bankNameField = $bank['name'] ?? '';
            if ($bankNameField !== '' && strpos(strtolower($bankNameField), $searchTerm) !== false) {
                $result[] = $bank;
            }
        }

        return $result;
    }

    /**
     * Get bank by short code
     */
    public static function getBankByShortCode(string $countryCode, string $shortCode): ?array
    {
        $banks = self::getAllBanks($countryCode);
        $shortCode = strtoupper($shortCode);

        foreach ($banks as $bank) {
            $bankShortCode = $bank['short_code'] ?? '';
            if ($bankShortCode !== '' && strtoupper($bankShortCode) === $shortCode) {
                return $bank;
            }
        }

        return null;
    }

    /**
     * Get all branches for a bank
     */
    public static function getBankBranches(string $countryCode, string $shortCode): array
    {
        $bank = self::getBankByShortCode($countryCode, $shortCode);
        return $bank['branches'] ?? [];
    }

    /**
     * Search branch by code
     */
    public static function searchBranchByCode(string $countryCode, string $branchCode): array
    {
        $banks = self::getAllBanks($countryCode);
        $result = [];
        $branchCode = strtoupper($branchCode);

        foreach ($banks as $bank) {
            if (!isset($bank['branches'])) {
                continue;
            }

            foreach ($bank['branches'] as $branch) {
                $branchCodeField = $branch['code'] ?? '';
                if ($branchCodeField !== '' && strtoupper($branchCodeField) === $branchCode) {
                    $result[] = array_merge($branch, [
                        'bank_name' => $bank['name'] ?? '',
                        'bank_short_code' => $bank['short_code'] ?? '',
                    ]);
                }
            }
        }

        return $result;
    }

    /**
     * Search branches by city
     */
    public static function searchBranchesByCity(string $countryCode, string $city): array
    {
        $banks = self::getAllBanks($countryCode);
        $result = [];
        $searchCity = strtolower($city);

        foreach ($banks as $bank) {
            if (!isset($bank['branches'])) {
                continue;
            }

            foreach ($bank['branches'] as $branch) {
                $branchCity = $branch['city'] ?? '';
                if ($branchCity !== '' && strpos(strtolower($branchCity), $searchCity) !== false) {
                    $result[] = array_merge($branch, [
                        'bank_name' => $bank['name'] ?? '',
                        'bank_short_code' => $bank['short_code'] ?? '',
                    ]);
                }
            }
        }

        return $result;
    }

    /**
     * Validate bank identifier (IFSC, SWIFT, etc.)
     */
    public static function validateBankIdentifier(string $countryCode, string $identifier, ?string $type = null): bool
    {
        if (!$type) {
            $type = self::getDefaultIdentifierType($countryCode);
        }

        if (!$type) {
            return false;
        }

        switch (strtoupper($type)) {
            case 'IFSC':
                return self::validateIFSC($identifier);
            case 'SWIFT':
                return self::validateSWIFT($identifier);
            case 'ROUTING_NUMBER':
                return self::validateRoutingNumber($identifier);
            default:
                return !empty($identifier);
        }
    }

    /**
     * Validate IFSC code (India)
     */
    public static function validateIFSC(string $ifsc): bool
    {
        return preg_match('/^[A-Z]{4}0[A-Z0-9]{6}$/', strtoupper($ifsc)) === 1;
    }

    /**
     * Validate SWIFT code
     */
    public static function validateSWIFT(string $swift): bool
    {
        return preg_match('/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/', strtoupper($swift)) === 1;
    }

    /**
     * Validate US routing number
     */
    public static function validateRoutingNumber(string $routingNumber): bool
    {
        $cleanRoutingNumber = preg_replace('/[^\d]/', '', $routingNumber);

        if ($cleanRoutingNumber === null || strlen($cleanRoutingNumber) !== 9) {
            return false;
        }

        // Check digit validation
        $checksum = 0;
        for ($i = 0; $i < 9; $i += 3) {
            $checksum += (int)$cleanRoutingNumber[$i] * 3;
            if (isset($cleanRoutingNumber[$i + 1])) {
                $checksum += (int)$cleanRoutingNumber[$i + 1] * 7;
            }
            if (isset($cleanRoutingNumber[$i + 2])) {
                $checksum += (int)$cleanRoutingNumber[$i + 2];
            }
        }

        return $checksum % 10 === 0;
    }

    /**
     * Get branch by identifier
     */
    public static function getBranchByIdentifier(string $countryCode, string $identifier, ?string $type = null): ?array
    {
        if (!self::validateBankIdentifier($countryCode, $identifier, $type)) {
            return null;
        }

        $banks = self::getAllBanks($countryCode);
        $identifier = strtoupper($identifier);
        $identifierType = $type ?: self::getDefaultIdentifierType($countryCode);

        if (!$identifierType) {
            return null;
        }

        foreach ($banks as $bank) {
            if (!isset($bank['branches'])) {
                continue;
            }

            foreach ($bank['branches'] as $branch) {
                if (!isset($branch['identifiers'])) {
                    continue;
                }

                foreach ($branch['identifiers'] as $idType => $idValue) {
                    if (
                        strtoupper($idType) === strtoupper($identifierType) &&
                        strtoupper((string)$idValue) === $identifier
                    ) {
                        return array_merge($branch, [
                            'bank_name' => $bank['name'] ?? '',
                            'bank_short_code' => $bank['short_code'] ?? '',
                        ]);
                    }
                }
            }
        }

        return null;
    }

    /**
     * Check if bank codes are available for a country
     */
    public static function hasBankCodes(string $countryCode): bool
    {
        return !empty(self::getBankCodeData($countryCode));
    }
}
