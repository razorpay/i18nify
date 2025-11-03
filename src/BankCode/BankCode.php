<?php

namespace Razorpay\I18nify\BankCode;

use Razorpay\I18nify\Utils\DataLoader;

/**
 * Optimized BankCode utility class for handling large bank code datasets efficiently
 */
class BankCode
{
    private static array $defaultsCache = [];
    private static array $bankIndexCache = [];
    private static int $maxMemoryUsage = 67108864; // 64MB limit

    /**
     * Get bank code defaults for a specific country (lightweight operation)
     */
    public static function getBankCodeDefaults(string $countryCode): array
    {
        $countryCode = strtoupper($countryCode);

        if (isset(self::$defaultsCache[$countryCode])) {
            return self::$defaultsCache[$countryCode];
        }

        try {
            $filePath = self::getBankDataPath($countryCode);
            if (!file_exists($filePath)) {
                self::$defaultsCache[$countryCode] = [];
                return [];
            }

            // Read only the first part to get defaults
            $defaults = self::extractDefaultsFromFile($filePath);
            self::$defaultsCache[$countryCode] = $defaults;
            return $defaults;
        } catch (\Exception $e) {
            self::$defaultsCache[$countryCode] = [];
            return [];
        }
    }

    /**
     * Get bank code data for a specific country (memory-optimized)
     */
    public static function getBankCodeData(string $countryCode): array
    {
        // For backward compatibility, but now returns minimal data
        $defaults = self::getBankCodeDefaults($countryCode);
        return ['defaults' => $defaults, 'details' => []];
    }

    /**
     * Get default identifier type for a country
     */
    public static function getDefaultIdentifierType(string $countryCode): ?string
    {
        $defaults = self::getBankCodeDefaults($countryCode);
        return $defaults['identifier_type'] ?? null;
    }

    /**
     * Get all banks for a country (memory-optimized with streaming)
     */
    public static function getAllBanks(string $countryCode): array
    {
        $countryCode = strtoupper($countryCode);
        $filePath = self::getBankDataPath($countryCode);
        
        if (!file_exists($filePath)) {
            return [];
        }

        // Check file size and use appropriate strategy
        $fileSize = filesize($filePath);
        if ($fileSize > self::$maxMemoryUsage) {
            // Use streaming for large files
            return self::streamBanks($filePath);
        } else {
            // Use traditional loading for smaller files
            try {
                $data = DataLoader::loadData("bankcodes/{$countryCode}.json");
                return $data['details'] ?? [];
            } catch (\Exception $e) {
                return [];
            }
        }
    }

    /**
     * Search bank by name (memory-optimized)
     */
    public static function searchBankByName(string $countryCode, string $bankName): array
    {
        $filePath = self::getBankDataPath($countryCode);
        if (!file_exists($filePath)) {
            return [];
        }

        $searchTerm = strtolower($bankName);
        $results = [];
        
        self::streamProcessBanks($filePath, function($bank) use ($searchTerm, &$results) {
            $bankNameField = $bank['name'] ?? '';
            if ($bankNameField !== '' && strpos(strtolower($bankNameField), $searchTerm) !== false) {
                $results[] = $bank;
            }
            // Stop if we have too many results to prevent memory issues
            return count($results) < 100;
        });

        return $results;
    }

    /**
     * Get bank by short code (memory-optimized)
     */
    public static function getBankByShortCode(string $countryCode, string $shortCode): ?array
    {
        $filePath = self::getBankDataPath($countryCode);
        if (!file_exists($filePath)) {
            return null;
        }

        $shortCode = strtoupper($shortCode);
        $result = null;
        
        self::streamProcessBanks($filePath, function($bank) use ($shortCode, &$result) {
            $bankShortCode = $bank['short_code'] ?? '';
            if ($bankShortCode !== '' && strtoupper($bankShortCode) === $shortCode) {
                $result = $bank;
                return false; // Stop processing
            }
            return true; // Continue
        });

        return $result;
    }

    /**
     * Get all branches for a bank (memory-optimized)
     */
    public static function getBankBranches(string $countryCode, string $shortCode): array
    {
        $bank = self::getBankByShortCode($countryCode, $shortCode);
        return $bank['branches'] ?? [];
    }

    /**
     * Search branch by code (memory-optimized)
     */
    public static function searchBranchByCode(string $countryCode, string $branchCode): array
    {
        $filePath = self::getBankDataPath($countryCode);
        if (!file_exists($filePath)) {
            return [];
        }

        $branchCode = strtoupper($branchCode);
        $results = [];
        
        self::streamProcessBanks($filePath, function($bank) use ($branchCode, &$results) {
            if (!isset($bank['branches'])) {
                return true;
            }

            foreach ($bank['branches'] as $branch) {
                $branchCodeField = $branch['code'] ?? '';
                if ($branchCodeField !== '' && strtoupper($branchCodeField) === $branchCode) {
                    $results[] = array_merge($branch, [
                        'bank_name' => $bank['name'] ?? '',
                        'bank_short_code' => $bank['short_code'] ?? '',
                    ]);
                }
            }
            
            return count($results) < 50; // Limit results
        });

        return $results;
    }

    /**
     * Search branches by city (memory-optimized)
     */
    public static function searchBranchesByCity(string $countryCode, string $city): array
    {
        $filePath = self::getBankDataPath($countryCode);
        if (!file_exists($filePath)) {
            return [];
        }

        $searchCity = strtolower($city);
        $results = [];
        
        self::streamProcessBanks($filePath, function($bank) use ($searchCity, &$results) {
            if (!isset($bank['branches'])) {
                return true;
            }

            foreach ($bank['branches'] as $branch) {
                $branchCity = $branch['city'] ?? '';
                if ($branchCity !== '' && strpos(strtolower($branchCity), $searchCity) !== false) {
                    $results[] = array_merge($branch, [
                        'bank_name' => $bank['name'] ?? '',
                        'bank_short_code' => $bank['short_code'] ?? '',
                    ]);
                }
            }
            
            return count($results) < 100; // Limit results
        });

        return $results;
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
     * Get branch by identifier (memory-optimized)
     */
    public static function getBranchByIdentifier(string $countryCode, string $identifier, ?string $type = null): ?array
    {
        if (!self::validateBankIdentifier($countryCode, $identifier, $type)) {
            return null;
        }

        $filePath = self::getBankDataPath($countryCode);
        if (!file_exists($filePath)) {
            return null;
        }

        $identifier = strtoupper($identifier);
        $identifierType = $type ?: self::getDefaultIdentifierType($countryCode);

        if (!$identifierType) {
            return null;
        }

        $result = null;
        
        self::streamProcessBanks($filePath, function($bank) use ($identifier, $identifierType, &$result) {
            if (!isset($bank['branches'])) {
                return true;
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
                        $result = array_merge($branch, [
                            'bank_name' => $bank['name'] ?? '',
                            'bank_short_code' => $bank['short_code'] ?? '',
                        ]);
                        return false; // Stop processing
                    }
                }
            }
            
            return true; // Continue
        });

        return $result;
    }

    /**
     * Check if bank codes are available for a country
     */
    public static function hasBankCodes(string $countryCode): bool
    {
        $filePath = self::getBankDataPath($countryCode);
        return file_exists($filePath) && filesize($filePath) > 10;
    }

    /**
     * Get statistics for a country's bank data
     */
    public static function getBankStatistics(string $countryCode): array
    {
        $filePath = self::getBankDataPath($countryCode);
        if (!file_exists($filePath)) {
            return ['banks' => 0, 'branches' => 0, 'file_size' => 0];
        }

        $fileSize = filesize($filePath);
        $bankCount = 0;
        $branchCount = 0;

        self::streamProcessBanks($filePath, function($bank) use (&$bankCount, &$branchCount) {
            $bankCount++;
            $branchCount += count($bank['branches'] ?? []);
            return true;
        });

        return [
            'banks' => $bankCount,
            'branches' => $branchCount,
            'file_size' => $fileSize
        ];
    }

    // Private helper methods

    private static function getBankDataPath(string $countryCode): string
    {
        DataLoader::init(); // Ensure data path is initialized
        $dataPath = DataLoader::getDataPath();
        return $dataPath . "/bankcodes/{$countryCode}.json";
    }

    private static function extractDefaultsFromFile(string $filePath): array
    {
        $handle = fopen($filePath, 'r');
        if (!$handle) {
            return [];
        }

        $defaults = [];
        $buffer = '';
        $inDefaults = false;
        $braceCount = 0;

        while (($chunk = fread($handle, 1024)) !== false) {
            $buffer .= $chunk;
            
            // Look for the defaults section
            if (!$inDefaults && strpos($buffer, '"defaults"') !== false) {
                $inDefaults = true;
            }
            
            if ($inDefaults) {
                // Find the defaults object
                if (preg_match('/"defaults"\s*:\s*(\{[^}]*\})/', $buffer, $matches)) {
                    $defaultsJson = $matches[1];
                    $defaults = json_decode($defaultsJson, true) ?? [];
                    break;
                }
            }
            
            // If we've read too much, break to avoid memory issues
            if (strlen($buffer) > 4096) {
                break;
            }
        }

        fclose($handle);
        return $defaults;
    }

    private static function streamBanks(string $filePath): array
    {
        $banks = [];
        self::streamProcessBanks($filePath, function($bank) use (&$banks) {
            $banks[] = $bank;
            return count($banks) < 1000; // Limit for memory safety
        });
        return $banks;
    }

    private static function streamProcessBanks(string $filePath, callable $processor): void
    {
        $handle = fopen($filePath, 'r');
        if (!$handle) {
            return;
        }

        $buffer = '';
        $inDetails = false;
        $braceLevel = 0;
        $currentBank = '';
        $inBankObject = false;

        while (($chunk = fread($handle, 8192)) !== false) {
            $buffer .= $chunk;
            
            if (!$inDetails && strpos($buffer, '"details"') !== false) {
                $inDetails = true;
                // Skip to the start of the array
                $detailsPos = strpos($buffer, '"details"');
                $arrayStart = strpos($buffer, '[', $detailsPos);
                if ($arrayStart !== false) {
                    $buffer = substr($buffer, $arrayStart + 1);
                }
            }
            
            if ($inDetails) {
                $i = 0;
                while ($i < strlen($buffer)) {
                    $char = $buffer[$i];
                    
                    if ($char === '{' && !$inBankObject) {
                        $inBankObject = true;
                        $braceLevel = 1;
                        $currentBank = '{';
                    } elseif ($inBankObject) {
                        $currentBank .= $char;
                        
                        if ($char === '{') {
                            $braceLevel++;
                        } elseif ($char === '}') {
                            $braceLevel--;
                            
                            if ($braceLevel === 0) {
                                // We have a complete bank object
                                $bankData = json_decode($currentBank, true);
                                if ($bankData) {
                                    $continue = $processor($bankData);
                                    if (!$continue) {
                                        fclose($handle);
                                        return;
                                    }
                                }
                                
                                $inBankObject = false;
                                $currentBank = '';
                                
                                // Remove processed part from buffer
                                $buffer = substr($buffer, $i + 1);
                                $i = -1; // Will be incremented to 0
                            }
                        }
                    }
                    
                    $i++;
                }
            }
            
            // Check memory usage
            if (memory_get_usage() > 67108864) { // 64MB limit
                break;
            }
        }

        fclose($handle);
    }
} 