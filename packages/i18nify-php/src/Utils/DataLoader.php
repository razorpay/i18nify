<?php

namespace Razorpay\I18nify\Utils;

/**
 * DataLoader utility class for loading i18nify data
 */
class DataLoader
{
    /**
     * Base path to the i18nify-data directory
     */
    private static ?string $dataPath = null;

    /**
     * Cache for loaded data
     */
    private static array $cache = [];

    /**
     * Initialize the data path
     */
    /**
     * Get the current data path
     */
    public static function getDataPath(): string
    {
        if (self::$dataPath === null) {
            self::init();
        }
        
        if (self::$dataPath === null) {
            throw new \RuntimeException("Data path could not be initialized");
        }
        
        return self::$dataPath;    }
    public static function init(?string $dataPath = null): void
    {
        if ($dataPath === null) {
            // Default path relative to the package root
            $dataPath = __DIR__ . '/../../../../i18nify-data';
        }

        self::$dataPath = rtrim($dataPath, '/');
    }

    /**
     * Load data from a JSON file
     *
     * @param string $filePath Relative path to the JSON file from i18nify-data
     * @return array The decoded JSON data
     * @throws \RuntimeException If file doesn't exist or JSON is invalid
     */
    public static function loadData(string $filePath): array
    {
        if (self::$dataPath === null) {
            self::init();
        }

        $cacheKey = $filePath;
        if (isset(self::$cache[$cacheKey])) {
            return self::$cache[$cacheKey];
        }

        $fullPath = self::$dataPath . '/' . ltrim($filePath, '/');

        if (!file_exists($fullPath)) {
            throw new \RuntimeException("Data file not found: {$fullPath}");
        }

        $content = file_get_contents($fullPath);
        if ($content === false) {
            throw new \RuntimeException("Failed to read data file: {$fullPath}");
        }

        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException("Invalid JSON in file {$fullPath}: " . json_last_error_msg());
        }

        if (!is_array($data)) {
            throw new \RuntimeException("JSON data must be an array in file: {$fullPath}");
        }

        self::$cache[$cacheKey] = $data;
        return $data;
    }

    /**
     * Clear the data cache
     */
    public static function clearCache(): void
    {
        self::$cache = [];
    }

    /**
     * Set custom data path
     */
    public static function setDataPath(string $path): void
    {
        self::$dataPath = rtrim($path, '/');
        self::clearCache();
    }
}
