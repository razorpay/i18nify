(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.i18nify = {}));
})(this, (function (exports) { 'use strict';

    function formatCurrency (currency, amount, options) {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency }).format(amount);
    }

    function logger (label) {
        console.log("Hi I am logger service =", label);
    }

    var COUNTRY_PHONE_REGEX = {
        IN: /^[789]\d{9}$/,
    };
    function validatePhone (phone, country) {
        var regex = COUNTRY_PHONE_REGEX[country];
        return regex.test(phone);
    }

    exports.formatCurrency = formatCurrency;
    exports.logger = logger;
    exports.validatePhone = validatePhone;

}));
//# sourceMappingURL=index.js.map
