<?php

declare(strict_types=1);

namespace RZP\I18nify\Tests;

use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use RZP\I18nify\Currency\Currency;
use RZP\I18nify\Currency\FormatNumber;

class CurrencyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Currency::flushCache();
    }

    /**
     * @dataProvider getFormatNumberWithoutSymbolTestData
     */
    public function testFormatNumberWithoutSymbol(
        string $expected,
        int $subunits,
        string $currency,
        string $locale
    ): void {
        $major = Currency::convertToMajorUnit($subunits, $currency);

        $actual = Currency::formatNumberWithoutSymbol($major, [
            'currency' => $currency,
            'locale'   => $locale,
        ]);

        $this->assertSame($expected, $actual);
    }

    /**
     * @return array<int, array{0: string, 1: int, 2: string, 3: string}>
     */
    public function getFormatNumberWithoutSymbolTestData(): array
    {
        return [
            // [Expected]        [Subunits]   [Currency] [Locale]
            // INR keeps lakh/crore grouping
            ['0.00',             0,           'INR', 'en-IN'],
            ['1.23',             123,         'INR', 'en-IN'],
            ['1,23,456.78',      12345678,    'INR', 'en-IN'],
            ['1,23,45,678.90',   1234567890,  'INR', 'en-IN'],
            ['-1,23,456.78',     -12345678,   'INR', 'en-IN'],

            // International grouping per currency
            ['123,456.78',       12345678,    'MYR', 'en-US'],
            ['123,456.78',       12345678,    'SGD', 'en-US'],
            ['123,456.78',       12345678,    'USD', 'en-US'],
            ['12,345,678.90',    1234567890,  'MYR', 'en-US'],
            ['-123,456.78',      -12345678,   'SGD', 'en-US'],

            // Zero minor unit currency
            ['12,345,678',       12345678,    'JPY', 'en-US'],

            // Three minor unit currency
            ['12,345.678',       12345678,    'KWD', 'en-US'],
        ];
    }

    /**
     * The locale mapping ported from the API monolith's FormatsInvoiceAmounts
     * trait now lives in this package: callers only pass the currency.
     *
     * @dataProvider getCurrencyDerivedLocaleTestData
     */
    public function testFormatNumberWithoutSymbolDerivesLocaleFromCurrency(
        string $expected,
        int $subunits,
        string $currency
    ): void {
        $this->assertSame($expected, Currency::formatSubunitsWithoutSymbol($subunits, $currency));
    }

    /**
     * @return array<int, array{0: string, 1: int, 2: string}>
     */
    public function getCurrencyDerivedLocaleTestData(): array
    {
        return [
            ['1,23,456.78',    12345678,   'INR'],
            ['1,23,45,678.90', 1234567890, 'INR'],
            ['123,456.78',     12345678,   'MYR'],
            ['123,456.78',     12345678,   'SGD'],
            ['123,456.78',     12345678,   'USD'],
            ['12,345,678',     12345678,   'JPY'],
            ['12,345.678',     12345678,   'KWD'],
        ];
    }

    public function testLocaleForCurrency(): void
    {
        $this->assertSame('en-IN', FormatNumber::localeForCurrency('INR'));
        $this->assertSame('en-IN', FormatNumber::localeForCurrency('inr'));
        $this->assertSame('en-US', FormatNumber::localeForCurrency('MYR'));
        $this->assertSame('en-US', FormatNumber::localeForCurrency('SGD'));
        $this->assertSame('en-US', FormatNumber::localeForCurrency('ZZZ'));
    }

    public function testConvertToMajorUnit(): void
    {
        $this->assertSame(123456.78, Currency::convertToMajorUnit(12345678, 'MYR'));
        $this->assertSame(12345678.0, Currency::convertToMajorUnit(12345678, 'JPY'));
        $this->assertSame(12345.678, Currency::convertToMajorUnit(12345678, 'KWD'));
        $this->assertSame(0.0, Currency::convertToMajorUnit(0, 'INR'));
        $this->assertSame(-1234.56, Currency::convertToMajorUnit(-123456, 'INR'));
    }

    public function testConvertToMinorUnit(): void
    {
        $this->assertSame(12345678.0, Currency::convertToMinorUnit(123456.78, 'MYR'));
        $this->assertSame(12345678.0, Currency::convertToMinorUnit(12345678, 'JPY'));
        $this->assertSame(12345678.0, Currency::convertToMinorUnit(12345.678, 'KWD'));
    }

    public function testGetMinorUnit(): void
    {
        $this->assertSame(2, Currency::getMinorUnit('INR'));
        $this->assertSame(2, Currency::getMinorUnit('MYR'));
        $this->assertSame(0, Currency::getMinorUnit('JPY'));
        $this->assertSame(3, Currency::getMinorUnit('KWD'));
        $this->assertSame(2, Currency::getMinorUnit('ZZZ'), 'unknown codes fall back to 2 minor units');
    }

    public function testGetCurrencySymbol(): void
    {
        $this->assertSame('RM', Currency::getCurrencySymbol('MYR'));
        $this->assertSame('S$', Currency::getCurrencySymbol('SGD'));
        $this->assertSame('₹', Currency::getCurrencySymbol('INR'));
        $this->assertSame('$', Currency::getCurrencySymbol('USD'));
        $this->assertSame('¥', Currency::getCurrencySymbol('JPY'));
    }

    public function testIsValidCurrencyCode(): void
    {
        $this->assertTrue(Currency::isValidCurrencyCode('INR'));
        $this->assertTrue(Currency::isValidCurrencyCode('myr'));
        $this->assertFalse(Currency::isValidCurrencyCode('ZZZ'));
        $this->assertFalse(Currency::isValidCurrencyCode(''));
    }

    public function testFormatNumberIncludesSymbol(): void
    {
        $this->assertSame('RM123,456.78', Currency::formatNumber(123456.78, [
            'currency' => 'MYR',
            'locale'   => 'en-US',
        ]));

        $this->assertSame('₹1,23,456.78', Currency::formatNumber(123456.78, [
            'currency' => 'INR',
            'locale'   => 'en-IN',
        ]));

        $this->assertSame('-$123,456.78', Currency::formatNumber(-123456.78, [
            'currency' => 'USD',
            'locale'   => 'en-US',
        ]));
    }

    public function testFormatNumberPlacesSuffixSymbolAfterTheNumber(): void
    {
        // EUR is marked symbol_position: suffix in i18nify-data
        $this->assertSame('123,456.78€', Currency::formatNumber(123456.78, [
            'currency' => 'EUR',
            'locale'   => 'en-US',
        ]));
    }

    public function testFormatNumberWithoutCurrencyUsesDefaultLocale(): void
    {
        // Currency::DEFAULT_LOCALE is en-IN, matching i18nify-go and i18nify-js
        $this->assertSame('1,23,456.78', Currency::formatNumber(123456.78));
    }

    public function testFormatNumberByPartsShape(): void
    {
        $parts = Currency::formatNumberByParts(-123456.78, [
            'currency' => 'MYR',
            'locale'   => 'en-US',
        ]);

        $this->assertSame('123,456', $parts['integer']);
        $this->assertSame('.', $parts['decimal']);
        $this->assertSame('78', $parts['fraction']);
        $this->assertSame('RM', $parts['currency']);
        $this->assertSame('-', $parts['minusSign']);
        $this->assertTrue($parts['isPrefixSymbol']);

        $this->assertSame(
            [
                ['type' => 'minusSign', 'value' => '-'],
                ['type' => 'currency',  'value' => 'RM'],
                ['type' => 'integer',   'value' => '123,456'],
                ['type' => 'decimal',   'value' => '.'],
                ['type' => 'fraction',  'value' => '78'],
            ],
            $parts['rawParts']
        );
    }

    public function testIntlOptionsOverrideFractionDigits(): void
    {
        $this->assertSame('123,457', Currency::formatNumberWithoutSymbol(123456.78, [
            'currency'    => 'USD',
            'locale'      => 'en-US',
            'intlOptions' => ['minimumFractionDigits' => 0, 'maximumFractionDigits' => 0],
        ]));

        $this->assertSame('123456.78', Currency::formatNumberWithoutSymbol(123456.78, [
            'currency'    => 'USD',
            'locale'      => 'en-US',
            'intlOptions' => ['useGrouping' => false],
        ]));
    }

    public function testUnknownCurrencyFallsBackToTwoMinorUnits(): void
    {
        $this->assertSame('123,456.78', Currency::formatNumberWithoutSymbol(123456.78, [
            'currency' => 'ZZZ',
            'locale'   => 'en-US',
        ]));
    }

    public function testFormattingIsCaseInsensitiveOnCurrencyCode(): void
    {
        $this->assertSame(
            Currency::formatSubunitsWithoutSymbol(12345678, 'INR'),
            Currency::formatSubunitsWithoutSymbol(12345678, 'inr')
        );
    }

    public function testNonNumericAmountIsRejected(): void
    {
        $this->expectException(InvalidArgumentException::class);

        Currency::formatNumber('not-a-number', ['currency' => 'INR']);
    }

    public function testDataSetIsTheCanonicalI18nifyData(): void
    {
        // In the monorepo the SDK must read i18nify-data/currency/data.json in
        // place — no copy inside the package.
        $this->assertSame(
            realpath(__DIR__ . '/../../../i18nify-data/currency/data.json'),
            realpath(Currency::resolveDataPath()),
            'the PHP SDK should read the canonical i18nify dataset directly'
        );

        $list = Currency::getCurrencyList();

        $this->assertArrayHasKey('INR', $list);
        $this->assertArrayHasKey('minor_unit', $list['INR']);
        $this->assertArrayHasKey('numeric_code', $list['INR']);
        $this->assertArrayHasKey('symbol', $list['INR']);
        $this->assertArrayHasKey('symbol_position', $list['INR']);
        $this->assertGreaterThan(150, count($list));
    }
}
