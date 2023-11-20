var PHONE_REGEX_MAPPER = {
    IN: /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/,
    MY: /^(?:(?:\+|0{0,2})60\s*[-]?\s*|[0]?)?[1-9]\d{7,9}$/,
};

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

export { formatPhoneNumber$1 as formatPhoneNumber, validatePhoneNumber$1 as validatePhoneNumber };
//# sourceMappingURL=index.js.map
