<?php

declare(strict_types=1);

namespace RZP\I18nify\Currency;

use InvalidArgumentException;

/**
 * i18nify currency module — PHP.
 *
 * Public API mirrors i18nify-js (`packages/i18nify-js/src/modules/currency`) and
 * i18nify-go (`packages/i18nify-go/modules/currency`): formatNumber,
 * formatNumberByParts, convertToMajorUnit, convertToMinorUnit, getCurrencySymbol,
 * getMinorUnit.
 *
 * PHP's NumberFormatter (ext-intl) binds to the same ICU/CLDR engine that backs
 * the JS Intl.NumberFormat used by i18nify, so formatted output is identical
 * across the three SDKs for the same locale and fraction digits.
 *
 * Currency metadata is read straight from the canonical i18nify dataset at
 * `i18nify-data/currency/data.json`. This package keeps no copy of it in git —
 * inside the monorepo the file is read in place, and the release pipeline
 * materialises it into the published dist (which is not a git artefact). See
 * agent_docs/php-package.md.
 *
 * @see https://github.com/razorpay/i18nify/blob/master/i18nify-data/currency/data.json
 */
class Currency
{
    /**
     * Default locale when the caller does not pass one.
     * Matches i18nify-go's `defaultLocale` and the JS default.
     */
    public const DEFAULT_LOCALE = 'en-IN';

    public const SYMBOL_POSITION_PREFIX = 'prefix';

    public const SYMBOL_POSITION_SUFFIX = 'suffix';

    /**
     * Fallback minor unit for currency codes absent from the dataset.
     */
    public const DEFAULT_MINOR_UNIT = 2;

    /**
     * Environment variable that overrides dataset discovery entirely.
     * Useful when the dataset is deployed outside the package (shared volume,
     * config-managed path, test fixture).
     */
    public const DATA_PATH_ENV = 'I18NIFY_CURRENCY_DATA_PATH';

    /**
     * Candidate locations for the currency dataset, in priority order.
     *
     * 1. The canonical file in the i18nify monorepo — used when this package is
     *    consumed in place (local dev, CI, `path` composer repositories). Read
     *    directly, so there is never a second copy to keep in sync.
     * 2. A dist-local copy at `src/Currency/data/currency.json`. This path does
     *    not exist in git; the release pipeline materialises it so that
     *    Composer installs are self-contained.
     */
    private const DATA_PATH_CANDIDATES = [
        __DIR__ . '/../../../../i18nify-data/currency/data.json',
        __DIR__ . '/data/currency.json',
    ];

    /**
     * Explicit dataset path set via setDataPath().
     *
     * @var string|null
     */
    private static $dataPath = null;

    /**
     * Parsed i18nify-data currency information, keyed by ISO 4217 alpha code.
     *
     * @var array<string, array<string, mixed>>|null
     */
    private static $currencyInformation = null;

    /**
     * Points the SDK at a specific dataset file. Takes precedence over the
     * environment variable and the built-in candidates.
     */
    public static function setDataPath(?string $path): void
    {
        self::$dataPath = $path;

        self::$currencyInformation = null;
    }

    /**
     * Absolute path of the dataset this process will read.
     */
    public static function resolveDataPath(): string
    {
        $explicit = self::$dataPath ?? (getenv(self::DATA_PATH_ENV) ?: null);

        if ($explicit !== null) {
            if (is_file($explicit) === false) {
                throw new \RuntimeException(sprintf(
                    'i18nify currency dataset not found at the configured path "%s".',
                    $explicit
                ));
            }

            return realpath($explicit) ?: $explicit;
        }

        foreach (self::DATA_PATH_CANDIDATES as $candidate) {
            if (is_file($candidate)) {
                // Normalise the ../.. walk so diagnostics and error messages
                // show a path a human can act on.
                return realpath($candidate) ?: $candidate;
            }
        }

        throw new \RuntimeException(
            'i18nify currency dataset not found. Looked in: '
            . implode(', ', array_map([self::class, 'normalisePath'], self::DATA_PATH_CANDIDATES))
            . '. Inside the i18nify monorepo the canonical file is i18nify-data/currency/data.json; '
            . 'for a packaged install run scripts/php/sync-data.sh --deref, or set the '
            . self::DATA_PATH_ENV . ' environment variable.'
        );
    }

    /**
     * Collapses `a/b/../c` segments for readable diagnostics. Unlike realpath()
     * this works on paths that do not exist, which is exactly the case when we
     * are reporting where we failed to find the dataset.
     */
    private static function normalisePath(string $path): string
    {
        $isAbsolute = strpos($path, DIRECTORY_SEPARATOR) === 0;

        $segments = [];

        foreach (explode(DIRECTORY_SEPARATOR, $path) as $segment) {
            if ($segment === '' || $segment === '.') {
                continue;
            }

            if ($segment === '..' && $segments !== [] && end($segments) !== '..') {
                array_pop($segments);

                continue;
            }

            $segments[] = $segment;
        }

        return ($isAbsolute ? DIRECTORY_SEPARATOR : '') . implode(DIRECTORY_SEPARATOR, $segments);
    }

    /**
     * All currency information from the canonical dataset, keyed by ISO code.
     *
     * Mirrors i18nify-js getCurrencyList().
     *
     * @return array<string, array<string, mixed>>
     */
    public static function getCurrencyList(): array
    {
        if (self::$currencyInformation === null) {
            $path = self::resolveDataPath();

            $json = @file_get_contents($path);

            if ($json === false) {
                throw new \RuntimeException('i18nify currency dataset at ' . $path . ' could not be read.');
            }

            $decoded = json_decode($json, true);

            if (is_array($decoded) === false || isset($decoded['currency_information']) === false) {
                throw new \RuntimeException('i18nify currency dataset at ' . $path . ' is malformed.');
            }

            self::$currencyInformation = $decoded['currency_information'];
        }

        return self::$currencyInformation;
    }

    /**
     * Currency information for a single ISO code.
     *
     * Unknown codes fall back to a 2-minor-unit, prefix-symbol shape using the
     * code itself as the symbol, so formatting never hard-fails on an
     * unrecognised currency. Use isValidCurrencyCode() when you need strictness.
     *
     * Mirrors i18nify-js getCurrencyList()[$currencyCode].
     *
     * @return array<string, mixed>
     */
    public static function getCurrencyInformation(string $currencyCode): array
    {
        $code = strtoupper($currencyCode);

        $list = self::getCurrencyList();

        return $list[$code] ?? [
            'name'            => $code,
            'minor_unit'      => (string) self::DEFAULT_MINOR_UNIT,
            'symbol'          => $code,
            'symbol_position' => self::SYMBOL_POSITION_PREFIX,
        ];
    }

    /**
     * Whether the code exists in the canonical i18nify dataset.
     *
     * Mirrors i18nify-js isValidCurrencyCode().
     */
    public static function isValidCurrencyCode(string $currencyCode): bool
    {
        if ($currencyCode === '') {
            return false;
        }

        return isset(self::getCurrencyList()[strtoupper($currencyCode)]);
    }

    /**
     * Number of decimal places the currency subdivides into (ISO 4217 minor unit).
     * E.g. INR/USD -> 2, JPY -> 0, KWD -> 3.
     */
    public static function getMinorUnit(string $currencyCode): int
    {
        return (int) self::getCurrencyInformation($currencyCode)['minor_unit'];
    }

    /**
     * Mirrors i18nify-js getCurrencySymbol(currencyCode).
     */
    public static function getCurrencySymbol(string $currencyCode): string
    {
        return (string) self::getCurrencyInformation($currencyCode)['symbol'];
    }

    /**
     * Whether the currency symbol precedes the number for this currency.
     */
    public static function isPrefixSymbol(string $currencyCode): bool
    {
        $position = self::getCurrencyInformation($currencyCode)['symbol_position'] ?? self::SYMBOL_POSITION_PREFIX;

        return $position === self::SYMBOL_POSITION_PREFIX;
    }

    /**
     * Converts a subunit amount to major units.
     * E.g. 12345678 subunits of MYR -> 123456.78
     *
     * Mirrors i18nify-js convertToMajorUnit(amount, {currency}).
     *
     * @param int|float|string $amount Amount in currency subunits
     */
    public static function convertToMajorUnit($amount, string $currencyCode): float
    {
        return self::assertNumeric($amount) / (10 ** self::getMinorUnit($currencyCode));
    }

    /**
     * Converts a major-unit amount to subunits.
     * E.g. 123456.78 MYR -> 12345678
     *
     * Mirrors i18nify-js convertToMinorUnit(amount, {currency}).
     *
     * @param int|float|string $amount Amount in major units
     */
    public static function convertToMinorUnit($amount, string $currencyCode): float
    {
        return round(self::assertNumeric($amount) * (10 ** self::getMinorUnit($currencyCode)));
    }

    /**
     * Structured breakdown of the formatted number.
     *
     * Keys mirror the i18nify-js ByParts type: integer, decimal, fraction,
     * currency, minusSign, isPrefixSymbol, rawParts.
     *
     * Mirrors i18nify-js formatNumberByParts(amount, {currency, locale, intlOptions}).
     *
     * @param int|float|string     $amount  Amount in major units
     * @param array<string, mixed> $options currency, locale, intlOptions
     *
     * @return array<string, mixed>
     */
    public static function formatNumberByParts($amount, array $options = []): array
    {
        return FormatNumber::toParts(self::assertNumeric($amount), $options);
    }

    /**
     * Locale-aware number string including the canonical i18nify currency symbol.
     * E.g. formatNumber(123456.78, ['currency' => 'MYR', 'locale' => 'en-US']) -> 'RM123,456.78'
     *
     * Mirrors i18nify-js formatNumber(amount, {currency, locale, intlOptions}).
     *
     * @param int|float|string     $amount  Amount in major units
     * @param array<string, mixed> $options currency, locale, intlOptions
     */
    public static function formatNumber($amount, array $options = []): string
    {
        $parts = self::formatNumberByParts($amount, $options);

        return implode('', array_column($parts['rawParts'], 'value'));
    }

    /**
     * Locale-aware number string WITHOUT the currency symbol — the shape hosted
     * pages, invoices, PDFs and email templates need, since they render the
     * symbol separately.
     *
     * When 'locale' is omitted the display locale is derived from the currency
     * (INR keeps Indian lakh/crore grouping, everything else uses international
     * grouping). See FormatNumber::localeForCurrency().
     *
     * PHP-only addition; i18nify-js callers compose this from formatNumberByParts().
     *
     * @param int|float|string     $amount  Amount in major units
     * @param array<string, mixed> $options currency, locale, intlOptions
     */
    public static function formatNumberWithoutSymbol($amount, array $options = []): string
    {
        if (isset($options['locale']) === false && isset($options['currency']) === true) {
            $options['locale'] = FormatNumber::localeForCurrency((string) $options['currency']);
        }

        $parts = self::formatNumberByParts($amount, $options);

        return $parts['minusSign'] . $parts['integer'] . $parts['decimal'] . $parts['fraction'];
    }

    /**
     * Convenience: subunits in, display-ready number string out (no symbol).
     * Collapses convertToMajorUnit() + formatNumberWithoutSymbol() for the
     * common invoice/hosted-page case.
     *
     * @param int|float|string $amount Amount in currency subunits
     */
    public static function formatSubunitsWithoutSymbol($amount, string $currencyCode, ?string $locale = null): string
    {
        $options = ['currency' => $currencyCode];

        if ($locale !== null) {
            $options['locale'] = $locale;
        }

        return self::formatNumberWithoutSymbol(self::convertToMajorUnit($amount, $currencyCode), $options);
    }

    /**
     * Resets the in-process dataset cache. Test/CLI helper.
     */
    public static function flushCache(): void
    {
        self::$currencyInformation = null;

        FormatNumber::flushCache();
    }

    /**
     * @param int|float|string $amount
     */
    private static function assertNumeric($amount): float
    {
        if (is_numeric($amount) === false) {
            throw new InvalidArgumentException(sprintf(
                "Parameter 'amount' is not a valid number. The received value was: %s of type %s.",
                var_export($amount, true),
                gettype($amount)
            ));
        }

        return (float) $amount;
    }
}
