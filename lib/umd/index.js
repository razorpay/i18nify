(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.i18nify = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    // Custom Error class to extend properties to error object
    var I18nifyError = /** @class */ (function (_super) {
        __extends(I18nifyError, _super);
        function I18nifyError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = 'i18nify Error';
            _this.timestamp = new Date();
            return _this;
            // more params like type of error/severity can be added in future for better debugging.
        }
        return I18nifyError;
    }(Error));
    /**
     * withErrorBoundary is a higher order function that takes function as parameter and wraps it in try/catch block.
     * It appends additional attributes and serves as a centralized error-handling service.
     * Usage =>
     * const wrappedUtilityFn = withErrorBoundary(utilityFn)
     *
     * @param fn utility that is wrapped in error boundary
     * @returns {Function} returns the function wrapped in try/catch block
     */
    var withErrorBoundary = function (fn) {
        return function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            try {
                return fn.call.apply(fn, __spreadArray([this], rest, false));
            }
            catch (err) {
                // Currently, we are throwing the error as it is to consumers.
                // In the future, this can be modified as per our requirement, like an error logging service.
                throw new I18nifyError(err);
            }
        };
    };

    var getLocale = function () {
        // Check if running in a non-browser environment (e.g., Node.js or older browsers).
        if (navigator === undefined) {
            return 'en-IN';
        }
        // Check if the browser supports the Intl object and user language preferences.
        if (window.Intl &&
            typeof window.Intl === 'object' &&
            (window.navigator.languages || window.navigator.language)) {
            var userLocales = window.navigator.languages || [
                window.navigator.language,
            ];
            return userLocales[0];
        }
        // Fallback to a supported locale or the default locale.
        return 'en-IN';
    };

    var getIntlInstanceWithOptions = function (options) {
        if (options === void 0) { options = {}; }
        var locale = options === null || options === void 0 ? void 0 : options.locale;
        // If a specific locale is provided, use it; otherwise, use the browser's locale
        if (!locale) {
            locale = getLocale();
        }
        var intlOptions = (options === null || options === void 0 ? void 0 : options.intlOptions) ? __assign({}, options.intlOptions) : {};
        if ((options === null || options === void 0 ? void 0 : options.currency) || intlOptions.currency) {
            intlOptions.style = 'currency';
            intlOptions.currency = (options.currency || intlOptions.currency);
        }
        if (!locale)
            throw new Error('Pass valid locale !');
        return new Intl.NumberFormat(locale || undefined, intlOptions);
    };

    // this function formats number based on different arguments passed
    var formatNumber = function (amount, options) {
        if (options === void 0) { options = {}; }
        if (!Number(amount) && Number(amount) !== 0)
            throw new Error('Parameter `amount` is not a number!');
        var formattedAmount = '';
        try {
            formattedAmount = getIntlInstanceWithOptions(options).format(Number(amount));
        }
        catch (err) {
            throw new Error(err.message);
        }
        return formattedAmount;
    };
    var formatNumber$1 = withErrorBoundary(formatNumber);

    var CURRENCIES = {
        AED: { symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
        ALL: { symbol: 'Lek', name: 'Albanian Lek' },
        AMD: { symbol: '֏', name: 'Armenian Dram' },
        ARS: { symbol: 'ARS', name: 'Argentine Peso' },
        AUD: { symbol: 'A$', name: 'Australian Dollar' },
        AWG: { symbol: 'Afl.', name: 'Aruban Florin' },
        BBD: { symbol: '$', name: 'Barbadian Dollar' },
        BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
        BMD: { symbol: '$', name: 'Bermudian Dollar' },
        BND: { symbol: 'BND', name: 'Brunei Dollar' },
        BOB: { symbol: 'Bs', name: 'Bolivian Boliviano' },
        BSD: { symbol: 'B$', name: 'Bahamian Dollar' },
        BWP: { symbol: 'P', name: 'Botswanan Pula' },
        BZD: { symbol: 'BZ$', name: 'Belize Dollar' },
        CAD: { symbol: 'C$', name: 'Canadian Dollar' },
        CHF: { symbol: 'CHf', name: 'Swiss Franc' },
        CNY: { symbol: '¥', name: 'Chinese Yuan' },
        COP: { symbol: 'COL$', name: 'Colombian Peso' },
        CRC: { symbol: '₡', name: 'Costa Rican Colón' },
        CUP: { symbol: '$MN', name: 'Cuban Peso' },
        CZK: { symbol: 'Kč', name: 'Czech Koruna' },
        DKK: { symbol: 'DKK', name: 'Danish Krone' },
        DOP: { symbol: 'RD$', name: 'Dominican Peso' },
        DZD: { symbol: 'د.ج', name: 'Algerian Dinar' },
        EGP: { symbol: 'E£', name: 'Egyptian Pound' },
        ETB: { symbol: 'ብር', name: 'Ethiopian Birr' },
        EUR: { symbol: '€', name: 'Euro' },
        FJD: { symbol: 'FJ$', name: 'Fijian Dollar' },
        GBP: { symbol: '£', name: 'British Pound' },
        GHS: { symbol: 'GH₵', name: 'Ghanaian Cedi' },
        GIP: { symbol: 'GIP', name: 'Gibraltar Pound' },
        GMD: { symbol: 'D', name: 'Gambian Dalasi' },
        GTQ: { symbol: 'Q', name: 'Guatemalan Quetzal' },
        GYD: { symbol: 'G$', name: 'Guyanese Dollar' },
        HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
        HNL: { symbol: 'HNL', name: 'Honduran Lempira' },
        HRK: { symbol: 'kn', name: 'Croatian Kuna' },
        HTG: { symbol: 'G', name: 'Haitian Gourde' },
        HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
        IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
        ILS: { symbol: '₪', name: 'Israeli New Shekel' },
        INR: { symbol: '₹', name: 'Indian Rupee' },
        JMD: { symbol: 'J$', name: 'Jamaican Dollar' },
        KES: { symbol: 'Ksh', name: 'Kenyan Shilling' },
        KGS: { symbol: 'Лв', name: 'Kyrgystani Som' },
        KHR: { symbol: '៛', name: 'Cambodian Riel' },
        KYD: { symbol: 'CI$', name: 'Cayman Islands Dollar' },
        KZT: { symbol: '₸', name: 'Kazakhstani Tenge' },
        LAK: { symbol: '₭', name: 'Laotian Kip' },
        LKR: { symbol: 'රු', name: 'Sri Lankan Rupee' },
        LRD: { symbol: 'L$', name: 'Liberian Dollar' },
        LSL: { symbol: 'LSL', name: 'Lesotho Loti' },
        MAD: { symbol: 'د.م.', name: 'Moroccan Dirham' },
        MDL: { symbol: 'MDL', name: 'Moldovan Leu' },
        MKD: { symbol: 'ден', name: 'Macedonian Denar' },
        MMK: { symbol: 'MMK', name: 'Myanmar Kyat' },
        MNT: { symbol: '₮', name: 'Mongolian Tugrik' },
        MOP: { symbol: 'MOP$', name: 'Macanese Pataca' },
        MUR: { symbol: '₨', name: 'Mauritian Rupee' },
        MVR: { symbol: 'Rf', name: 'Maldivian Rufiyaa' },
        MWK: { symbol: 'MK', name: 'Malawian Kwacha' },
        MXN: { symbol: 'Mex$', name: 'Mexican Peso' },
        MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
        NAD: { symbol: 'N$', name: 'Namibian Dollar' },
        NGN: { symbol: '₦', name: 'Nigerian Naira' },
        NIO: { symbol: 'NIO', name: 'Nicaraguan Córdoba' },
        NOK: { symbol: 'NOK', name: 'Norwegian Krone' },
        NPR: { symbol: 'रू', name: 'Nepalese Rupee' },
        NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
        PEN: { symbol: 'S/', name: 'Peruvian Nuevo Sol' },
        PGK: { symbol: 'PGK', name: 'Papua New Guinean Kina' },
        PHP: { symbol: '₱', name: 'Philippine Peso' },
        PKR: { symbol: '₨', name: 'Pakistani Rupee' },
        QAR: { symbol: 'QR', name: 'Qatari Riyal' },
        RUB: { symbol: '₽', name: 'Russian Ruble' },
        SAR: { symbol: 'SR', name: 'Saudi Riyal' },
        SCR: { symbol: 'SRe', name: 'Seychellois Rupee' },
        SEK: { symbol: 'SEK', name: 'Swedish Krona' },
        SGD: { symbol: 'S$', name: 'Singapore Dollar' },
        SLL: { symbol: 'Le', name: 'Sierra Leonean Leone' },
        SOS: { symbol: 'Sh.so.', name: 'Somali Shilling' },
        SSP: { symbol: 'SS£', name: 'South Sudanese Pound' },
        SVC: { symbol: '₡', name: 'Salvadoran Colón' },
        SZL: { symbol: 'E', name: 'Swazi Lilangeni' },
        THB: { symbol: '฿', name: 'Thai Baht' },
        TTD: { symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
        TZS: { symbol: 'Sh', name: 'Tanzanian Shilling' },
        USD: { symbol: '$', name: 'United States Dollar' },
        UYU: { symbol: '$U', name: 'Uruguayan Peso' },
        UZS: { symbol: "so'm", name: 'Uzbekistani Som' },
        YER: { symbol: '﷼', name: 'Yemeni Rial' },
        ZAR: { symbol: 'R', name: 'South African Rand' },
        KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar' },
        BHD: { symbol: 'د.ب.', name: 'Bahraini Dinar' },
        OMR: { symbol: 'ر.ع.', name: 'Omani Rial' },
    };

    var getCurrencyList = function () {
        return CURRENCIES;
    };
    var getCurrencyList$1 = withErrorBoundary(getCurrencyList);

    var getCurrencySymbol = function (currencyCode) {
        var _a;
        if (currencyCode in CURRENCIES)
            return (_a = CURRENCIES[currencyCode]) === null || _a === void 0 ? void 0 : _a.symbol;
        else
            throw new Error('Invalid currencyCode!');
    };
    var getCurrencySymbol$1 = withErrorBoundary(getCurrencySymbol);

    var formatNumberByParts = function (amount, options) {
        if (options === void 0) { options = {}; }
        if (!Number(amount) && Number(amount) !== 0)
            throw new Error('Parameter `amount` is not a number!');
        try {
            var formattedAmount = getIntlInstanceWithOptions(options).formatToParts(Number(amount));
            var parts = formattedAmount;
            var integerValue_1 = '';
            var decimalValue_1 = '';
            var currencySymbol_1 = '';
            var separator_1 = '';
            var symbolAtFirst = true;
            var partValues = parts.map(function (p) {
                if (p.type === 'integer' || p.type === 'group')
                    integerValue_1 += p.value;
                else if (p.type === 'fraction')
                    decimalValue_1 += p.value;
                else if (p.type === 'currency')
                    currencySymbol_1 += p.value;
                else if (p.type === 'decimal')
                    separator_1 += p.value;
                return p.value;
            });
            if (currencySymbol_1.toString() !== partValues[0].toString())
                symbolAtFirst = false;
            return {
                currencySymbol: currencySymbol_1,
                decimalValue: decimalValue_1,
                integerValue: integerValue_1,
                separator: separator_1,
                symbolAtFirst: symbolAtFirst,
            };
        }
        catch (error) {
            throw new Error("Something went wrong- ".concat(error.message));
        }
    };
    var formatNumberByParts$1 = withErrorBoundary(formatNumberByParts);

    var PHONE_REGEX_MAPPER = {
        IN: /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/,
        MY: /^(?:(?:\+|0{0,2})60\s*[-]?\s*|[0]?)?[1-9]\d{7,9}$/,
    };

    var detectCountryCodeFromDialCode = function (phoneNumber) {
        for (var countryCode in PHONE_REGEX_MAPPER) {
            if (Object.prototype.hasOwnProperty.call(PHONE_REGEX_MAPPER, countryCode)) {
                var regex = PHONE_REGEX_MAPPER[countryCode];
                if (regex.test(phoneNumber.toString())) {
                    return countryCode;
                }
            }
        }
        throw new Error('Unable to detect `country code` from phone number.');
    };
    var removeNonNumericChars = function (phoneNumber) {
        // Regular expression to match all characters except numbers and + sign at the start
        var regex = /^[^0-9+]+/g;
        // Replace matched characters with an empty string
        var cleanedString = phoneNumber.replace(regex, '');
        return cleanedString;
    };

    var validatePhoneNumber = function (phoneNumber, countryCode) {
        var cleanedPhoneNumber = removeNonNumericChars(phoneNumber.toString());
        if (!countryCode)
            countryCode = detectCountryCodeFromDialCode(cleanedPhoneNumber);
        if (!phoneNumber)
            throw new Error('Parameter `phoneNumber` is invalid!');
        if (Object.prototype.hasOwnProperty.call(PHONE_REGEX_MAPPER, countryCode)) {
            var regex = PHONE_REGEX_MAPPER[countryCode];
            return regex.test(cleanedPhoneNumber);
        }
        // Return false if the country code is not supported
        return false;
    };
    var validatePhoneNumber$1 = withErrorBoundary(validatePhoneNumber);

    var PHONE_FORMATTER_MAPPER = {
        IN: 'xxxx xxxxxx',
        MY: 'xx xxxxx xx',
    };

    var formatPhoneNumber = function (phoneNumber, countryCode) {
        if (!countryCode)
            countryCode = detectCountryCodeFromDialCode(phoneNumber);
        var pattern = PHONE_FORMATTER_MAPPER[countryCode];
        if (!pattern)
            throw new Error('Parameter `countryCode` is invalid!');
        if (!phoneNumber)
            throw new Error('Parameter `phoneNumber` is invalid!');
        phoneNumber = phoneNumber.toString();
        var charCountInFormatterPattern = 0;
        for (var i = 0; i < pattern.length; i++) {
            if (pattern[i] === 'x') {
                charCountInFormatterPattern++;
            }
        }
        var diff = phoneNumber.length - charCountInFormatterPattern;
        var phoneNumberWithoutPrefix = phoneNumber.slice(diff);
        var formattedNumber = [];
        var numberIndex = 0;
        for (var i = 0; i < pattern.length; i++) {
            var patternChar = pattern[i];
            if (patternChar === 'x') {
                if (numberIndex < phoneNumberWithoutPrefix.length) {
                    formattedNumber.push(phoneNumberWithoutPrefix[numberIndex]);
                    numberIndex++;
                }
            }
            else {
                formattedNumber.push(patternChar);
            }
        }
        var formattedPhoneNumberWithoutPrefix = formattedNumber.join('');
        var formattedPhoneNumberWithPrefix = phoneNumber.slice(0, diff) + ' ' + formattedPhoneNumberWithoutPrefix;
        return formattedPhoneNumberWithPrefix.trim();
    };
    var formatPhoneNumber$1 = withErrorBoundary(formatPhoneNumber);

    var parsePhoneNumber = function (phoneNumber) {
        var countryCode = detectCountryCodeFromDialCode(phoneNumber);
        var formattedPhoneNumber = formatPhoneNumber$1(phoneNumber, countryCode);
        var pattern = PHONE_FORMATTER_MAPPER[countryCode];
        if (!pattern)
            throw new Error('Parameter `countryCode` is invalid!');
        if (!phoneNumber)
            throw new Error('Parameter `phoneNumber` is invalid!');
        phoneNumber = phoneNumber.toString();
        var charCountInFormatterPattern = 0;
        for (var i = 0; i < pattern.length; i++) {
            if (pattern[i] === 'x') {
                charCountInFormatterPattern++;
            }
        }
        var diff = phoneNumber.length - charCountInFormatterPattern;
        var dialCode = phoneNumber.slice(0, diff);
        var formatTemplate = PHONE_FORMATTER_MAPPER[countryCode];
        return {
            countryCode: countryCode,
            formattedPhoneNumber: formattedPhoneNumber,
            dialCode: dialCode,
            formatTemplate: formatTemplate,
        };
    };
    var parsePhoneNumber$1 = withErrorBoundary(parsePhoneNumber);

    exports.formatNumber = formatNumber$1;
    exports.formatNumberByParts = formatNumberByParts$1;
    exports.formatPhoneNumber = formatPhoneNumber$1;
    exports.getCurrencyList = getCurrencyList$1;
    exports.getCurrencySymbol = getCurrencySymbol$1;
    exports.parsePhoneNumber = parsePhoneNumber$1;
    exports.validatePhoneNumber = validatePhoneNumber$1;

}));
//# sourceMappingURL=index.js.map
