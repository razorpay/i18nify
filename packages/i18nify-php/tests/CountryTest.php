<?php

namespace Razorpay\I18nify\Tests;

use PHPUnit\Framework\TestCase;
use Razorpay\I18nify\Country\Country;
use Razorpay\I18nify\Utils\DataLoader;

class CountryTest extends TestCase
{
    public static function setUpBeforeClass(): void
    {
        // Initialize with the correct data path relative to the test location
        DataLoader::init(__DIR__ . '/../../../i18nify-data');
    }

    public function testGetCountryInfo(): void
    {
        $countryInfo = Country::getCountryInfo('US');

        $this->assertIsArray($countryInfo);
        $this->assertArrayHasKey('country_name', $countryInfo);
        $this->assertEquals('United States of America (the)', $countryInfo['country_name']);
    }

    public function testGetCountryName(): void
    {
        $name = Country::getCountryName('IN');
        $this->assertEquals('India', $name);
    }

    public function testGetDialCode(): void
    {
        $dialCode = Country::getDialCode('US');
        $this->assertEquals('+1', $dialCode);

        $dialCode = Country::getDialCode('IN');
        $this->assertEquals('+91', $dialCode);
    }

    public function testIsValidCountryCode(): void
    {
        $this->assertTrue(Country::isValidCountryCode('US'));
        $this->assertTrue(Country::isValidCountryCode('IN'));
        $this->assertFalse(Country::isValidCountryCode('INVALID'));
    }

    public function testGetDefaultCurrency(): void
    {
        $currency = Country::getDefaultCurrency('US');
        $this->assertEquals('USD', $currency);

        $currency = Country::getDefaultCurrency('IN');
        $this->assertEquals('INR', $currency);
    }

    public function testGetSupportedCurrencies(): void
    {
        $currencies = Country::getSupportedCurrencies('US');
        $this->assertIsArray($currencies);
        $this->assertContains('USD', $currencies);
    }

    public function testInvalidCountryCode(): void
    {
        $this->assertNull(Country::getCountryInfo('INVALID'));
        $this->assertNull(Country::getCountryName('INVALID'));
        $this->assertNull(Country::getDialCode('INVALID'));
    }

    public function testSearchCountriesByName(): void
    {
        $countries = Country::searchCountriesByName('United');
        $this->assertIsArray($countries);
        $this->assertArrayHasKey('US', $countries);
    }

    public function testGetContinentInfo(): void
    {
        $continent = Country::getContinentInfo('US');
        $this->assertIsArray($continent);
        $this->assertArrayHasKey('continent_code', $continent);
        $this->assertArrayHasKey('continent_name', $continent);
    }
}
