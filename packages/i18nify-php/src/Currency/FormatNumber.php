<?php

declare(strict_types=1);

namespace RZP\I18nify\Currency;

use NumberFormatter;
use RuntimeException;

/**
 * Number formatting engine for the currency module.
 *
 * Everything locale- and grouping-related lives here: display-locale resolution
 * per currency, the cached ext-intl NumberFormatter instances, and the assembly
 * of Intl-style formatted parts. Currency::formatNumber* delegates to this
 * class, so consumers never construct a NumberFormatter themselves.
 *
 * Counterpart of i18nify-go's `format_number.go` / `format_number_helpers.go`.
 * (Named FormatNumber.php rather than format_number.php because PSR-4
 * autoloading requires the filename to match the class name.)
 */
class FormatNumber
{
    /**
     * Display locale for currencies without a specific override.
     * International (thousands) grouping.
     */
    public const DEFAULT_DISPLAY_LOCALE = 'en-US';

    /**
     * Per-currency display locale for number grouping. INR keeps the Indian
     * lakh/crore grouping; every other currency uses international grouping.
     *
     * This is the mapping that used to live in the API monolith's
     * FormatsInvoiceAmounts trait — it belongs with the formatting logic.
     *
     * @var array<string, string>
     */
    private static $currencyDisplayLocales = [
        'INR' => 'en-IN',
    ];

    /**
     * @var array<string, NumberFormatter> Cache keyed by locale + fraction digits
     */
    private static $formatters = [];

    /**
     * Display locale to use for a currency when the caller does not pass one.
     *
     * E.g. INR -> 'en-IN' (1,23,456.78), MYR/SGD/USD -> 'en-US' (123,456.78).
     */
    public static function localeForCurrency(string $currencyCode): string
    {
        return self::$currencyDisplayLocales[strtoupper($currencyCode)] ?? self::DEFAULT_DISPLAY_LOCALE;
    }

    /**
     * Formats $amount and returns the Intl-style structured breakdown.
     *
     * @param array<string, mixed> $options currency, locale, intlOptions
     *
     * @return array<string, mixed>
     */
    public static function toParts(float $amount, array $options = []): array
    {
        self::assertIntlAvailable();

        // ICU locale ids use underscores; accept BCP 47 tags for parity with JS.
        $locale = str_replace('-', '_', (string) ($options['locale'] ?? Currency::DEFAULT_LOCALE));

        $currency = isset($options['currency']) ? strtoupper((string) $options['currency']) : null;

        $defaultFractionDigits = ($currency === null)
            ? Currency::DEFAULT_MINOR_UNIT
            : Currency::getMinorUnit($currency);

        $intlOptions = $options['intlOptions'] ?? [];

        $minFractionDigits = (int) ($intlOptions['minimumFractionDigits'] ?? $defaultFractionDigits);
        $maxFractionDigits = (int) ($intlOptions['maximumFractionDigits'] ?? $defaultFractionDigits);

        $useGrouping = $intlOptions['useGrouping'] ?? true;

        $formatter = self::formatter($locale, $minFractionDigits, $maxFractionDigits, (bool) $useGrouping);

        $formatted = $formatter->format(abs($amount));

        if ($formatted === false) {
            throw new RuntimeException(sprintf(
                'Failed to format amount for locale "%s": %s',
                $locale,
                $formatter->getErrorMessage()
            ));
        }

        $decimalSeparator = $formatter->getSymbol(NumberFormatter::DECIMAL_SEPARATOR_SYMBOL);

        $separatorPos = ($decimalSeparator === '' || $decimalSeparator === false)
            ? false
            : strrpos($formatted, $decimalSeparator);

        if (($maxFractionDigits > 0) && ($separatorPos !== false)) {
            $integer  = substr($formatted, 0, $separatorPos);
            $decimal  = $decimalSeparator;
            $fraction = substr($formatted, $separatorPos + strlen($decimalSeparator));
        } else {
            $integer  = $formatted;
            $decimal  = '';
            $fraction = '';
        }

        $minusSign = ($amount < 0) ? '-' : '';

        $symbol = ($currency === null) ? '' : Currency::getCurrencySymbol($currency);

        $isPrefixSymbol = ($currency === null) ? true : Currency::isPrefixSymbol($currency);

        $rawParts = [];

        if ($minusSign !== '') {
            $rawParts[] = ['type' => 'minusSign', 'value' => $minusSign];
        }

        if (($symbol !== '') && ($isPrefixSymbol === true)) {
            $rawParts[] = ['type' => 'currency', 'value' => $symbol];
        }

        $rawParts[] = ['type' => 'integer', 'value' => $integer];

        if ($decimal !== '') {
            $rawParts[] = ['type' => 'decimal', 'value' => $decimal];
            $rawParts[] = ['type' => 'fraction', 'value' => $fraction];
        }

        if (($symbol !== '') && ($isPrefixSymbol === false)) {
            $rawParts[] = ['type' => 'currency', 'value' => $symbol];
        }

        return [
            'integer'        => $integer,
            'decimal'        => $decimal,
            'fraction'       => $fraction,
            'currency'       => $symbol,
            'minusSign'      => $minusSign,
            'isPrefixSymbol' => $isPrefixSymbol,
            'rawParts'       => $rawParts,
        ];
    }

    /**
     * Cached decimal NumberFormatter for a locale + fraction-digit combination.
     */
    public static function formatter(
        string $locale,
        int $minFractionDigits,
        int $maxFractionDigits,
        bool $useGrouping = true
    ): NumberFormatter {
        $key = implode('|', [$locale, $minFractionDigits, $maxFractionDigits, $useGrouping ? '1' : '0']);

        if (isset(self::$formatters[$key]) === false) {
            $formatter = new NumberFormatter($locale, NumberFormatter::DECIMAL);

            $formatter->setAttribute(NumberFormatter::MIN_FRACTION_DIGITS, $minFractionDigits);
            $formatter->setAttribute(NumberFormatter::MAX_FRACTION_DIGITS, $maxFractionDigits);
            $formatter->setAttribute(NumberFormatter::GROUPING_USED, $useGrouping ? 1 : 0);

            self::$formatters[$key] = $formatter;
        }

        return self::$formatters[$key];
    }

    /**
     * Clears the formatter cache. Test/CLI helper.
     */
    public static function flushCache(): void
    {
        self::$formatters = [];
    }

    private static function assertIntlAvailable(): void
    {
        if (class_exists(NumberFormatter::class) === false) {
            throw new RuntimeException(
                'razorpay/i18nify-php requires the intl PHP extension (ext-intl) for currency formatting.'
            );
        }
    }
}
