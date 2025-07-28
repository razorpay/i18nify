<?php

namespace Razorpay\I18nify\Tests;

use PHPUnit\Framework\TestCase;
use Razorpay\I18nify\Currency\Currency;
use Razorpay\I18nify\Utils\DataLoader;

class CurrencyTest extends TestCase
{
    public static function setUpBeforeClass(): void
    {
        // Initialize with the correct data path relative to the test location
        DataLoader::init(__DIR__ . '/../../../i18nify-data');
    }

    public function testGetCurrencyInfo(): void
    {
        $currencyInfo = Currency::getCurrencyInfo('USD');

        $this->assertIsArray($currencyInfo);
        $this->assertArrayHasKey('name', $currencyInfo);
        $this->assertArrayHasKey('symbol', $currencyInfo);
    }

    public function testGetCurrencyName(): void
    {
        $name = Currency::getCurrencyName('USD');
        $this->assertIsString($name);
        $this->assertStringContainsString('Dollar', $name);
    }

    public function testGetCurrencySymbol(): void
    {
        $symbol = Currency::getCurrencySymbol('USD');
        $this->assertEquals('$', $symbol);
    }

    public function testGetMinorUnits(): void
    {
        $minorUnits = Currency::getMinorUnits('USD');
        $this->assertEquals(2, $minorUnits);
    }

    public function testIsValidCurrencyCode(): void
    {
        $this->assertTrue(Currency::isValidCurrencyCode('USD'));
        $this->assertTrue(Currency::isValidCurrencyCode('EUR'));
        $this->assertFalse(Currency::isValidCurrencyCode('INVALID'));
    }

    public function testFormatCurrency(): void
    {
        $formatted = Currency::formatCurrency(1234.56, 'USD');
        $this->assertIsString($formatted);
        $this->assertStringContainsString('$', $formatted);
        $this->assertStringContainsString('1,234.56', $formatted);
    }

    public function testToMinorUnits(): void
    {
        $minorUnits = Currency::toMinorUnits(12.34, 'USD');
        $this->assertEquals(1234, $minorUnits);
    }

    public function testFromMinorUnits(): void
    {
        $amount = Currency::fromMinorUnits(1234, 'USD');
        $this->assertEquals(12.34, $amount);
    }

    public function testGetAllCurrencyCodes(): void
    {
        $codes = Currency::getAllCurrencyCodes();
        $this->assertIsArray($codes);
        $this->assertContains('USD', $codes);
        $this->assertContains('EUR', $codes);
    }

    public function testSearchCurrenciesByName(): void
    {
        $currencies = Currency::searchCurrenciesByName('Dollar');
        $this->assertIsArray($currencies);
        $this->assertArrayHasKey('USD', $currencies);
    }

    public function testGetCurrencyDisplay(): void
    {
        $display = Currency::getCurrencyDisplay('USD');
        $this->assertIsArray($display);
        $this->assertArrayHasKey('code', $display);
        $this->assertArrayHasKey('name', $display);
        $this->assertArrayHasKey('symbol', $display);
        $this->assertArrayHasKey('minor_units', $display);
    }
}
