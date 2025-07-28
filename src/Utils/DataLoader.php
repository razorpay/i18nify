<?php

namespace Razorpay\I18nify\Utils;

/**
 * Optimized DataLoader utility class for loading i18nify data efficiently
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
     * Maximum file size to load into memory at once (32MB)
     */
    private static int $maxMemoryFileSize = 33554432;

    /**
     * Initialize the data path
     */
    public static function init(?string $dataPath = null): void
    {
        if ($dataPath === null) {
            // Default path relative to the package root
            $dataPath = __DIR__ . '/../../../../i18nify-data';
        }

        self::$dataPath = rtrim($dataPath, '/');
    }

    /**
     * Get the current data path
     */
    public static function getDataPath(): string
    {
        if (self::$dataPath === null) {
            self::init();
        }
        
        if (self::$dataPath === null) {
            throw new \RuntimeException('Data path could not be initialized');
        }
        
        return self::$dataPath;
    }

    /**
     * Load data from a JSON file (memory-optimized)
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

        $fileSize = filesize($fullPath);
        
        // For large files, don't cache them to save memory
        if ($fileSize > self::$maxMemoryFileSize) {
            return self::loadLargeFile($fullPath);
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

        // Only cache smaller files
        if ($fileSize <= self::$maxMemoryFileSize) {
            self::$cache[$cacheKey] = $data;
        }
        
        return $data;
    }

    /**
     * Load a large file without full caching (memory-efficient)
     */
    private static function loadLargeFile(string $fullPath): array
    {
        $handle = fopen($fullPath, 'r');
        if (!$handle) {
            throw new \RuntimeException("Failed to open large file: {$fullPath}");
        }

        $content = '';
        $chunkSize = 8192;
        $totalRead = 0;
        $maxRead = self::$maxMemoryFileSize; // Limit how much we read

        while (!feof($handle) && $totalRead < $maxRead) {
            $chunk = fread($handle, $chunkSize);
            if ($chunk === false) {
                break;
            }
            $content .= $chunk;
            $totalRead += strlen($chunk);
        }

        fclose($handle);

        if ($totalRead >= $maxRead) {
            // File too large, return minimal structure
            throw new \RuntimeException("File too large to load into memory: {$fullPath}");
        }

        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException("Invalid JSON in large file {$fullPath}: " . json_last_error_msg());
        }

        return $data ?? [];
    }

    /**
     * Check if a file exists in the data directory
     */
    public static function fileExists(string $filePath): bool
    {
        if (self::$dataPath === null) {
            self::init();
        }

        $fullPath = self::$dataPath . '/' . ltrim($filePath, '/');
        return file_exists($fullPath);
    }

    /**
     * Get file size for a data file
     */
    public static function getFileSize(string $filePath): int
    {
        if (self::$dataPath === null) {
            self::init();
        }

        $fullPath = self::$dataPath . '/' . ltrim($filePath, '/');
        if (!file_exists($fullPath)) {
            return 0;
        }

        return filesize($fullPath) ?: 0;
    }

    /**
     * Stream process a large JSON file with a callback
     */
    public static function streamProcessFile(string $filePath, callable $processor): void
    {
        if (self::$dataPath === null) {
            self::init();
        }

        $fullPath = self::$dataPath . '/' . ltrim($filePath, '/');
        
        if (!file_exists($fullPath)) {
            throw new \RuntimeException("Data file not found: {$fullPath}");
        }

        $handle = fopen($fullPath, 'r');
        if (!$handle) {
            throw new \RuntimeException("Failed to open file for streaming: {$fullPath}");
        }

        $buffer = '';
        $chunkSize = 8192;

        while (($chunk = fread($handle, $chunkSize)) !== false) {
            $buffer .= $chunk;
            
            // Process complete JSON objects as they become available
            // This is a simplified implementation - could be enhanced for specific JSON structures
            $processor($buffer);
            
            // Check memory usage
            if (memory_get_usage() > self::$maxMemoryFileSize) {
                break;
            }
        }

        fclose($handle);
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

    /**
     * Get memory usage statistics
     */
    public static function getMemoryStats(): array
    {
        return [
            'current_usage' => memory_get_usage(true),
            'peak_usage' => memory_get_peak_usage(true),
            'cached_files' => count(self::$cache),
            'limit' => self::$maxMemoryFileSize
        ];
    }

    /**
     * Set memory limit for file loading
     */
    public static function setMemoryLimit(int $bytes): void
    {
        self::$maxMemoryFileSize = $bytes;
    }
} 