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


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const loadPolyfills = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the Intl object and Intl.NumberFormat function are available
    if (!(typeof Intl !== 'undefined' &&
        typeof Intl.NumberFormat === 'function' &&
        typeof Intl.NumberFormat().formatToParts === 'function')) {
        const { default: intlFormatToPartsPolyfill } = yield Promise.resolve().then(function () { return intlFormatToPartsPolyfill$1; });
        intlFormatToPartsPolyfill();
    }
    // Add other polyfills here in similar fashion as above
});

// Custom Error class to extend properties to error object
class I18nifyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'i18nify Error';
        this.timestamp = new Date();
        // more params like type of error/severity can be added in future for better debugging.
    }
}
/**
 * withErrorBoundary is a higher order function that takes function as parameter and wraps it in try/catch block.
 * It appends additional attributes and serves as a centralized error-handling service.
 * Usage =>
 * const wrappedUtilityFn = withErrorBoundary(utilityFn)
 *
 * @param fn utility that is wrapped in error boundary
 * @returns {Function} returns the function wrapped in try/catch block
 */
const withErrorBoundary = (fn) => {
    return function (...rest) {
        try {
            return fn.call(this, ...rest);
        }
        catch (err) {
            console.warn('[I18N Error]: ', err);
            // Currently, we are throwing the error as it is to consumers.
            // In the future, this can be modified as per our requirement, like an error logging service.
            throw new I18nifyError(err);
        }
    };
};

function getDefaultState() {
    return {
        locale: '',
        direction: '',
        country: '',
    };
}

class I18nStateManager {
    constructor() {
        this.state = getDefaultState();
    }
    static getInstance() {
        if (!I18nStateManager.instance) {
            I18nStateManager.instance = new I18nStateManager();
        }
        return I18nStateManager.instance;
    }
    static resetInstance() {
        I18nStateManager.instance = undefined;
    }
    getState() {
        return Object.assign({}, this.state);
    }
    setState(newState) {
        this.state = Object.assign(Object.assign({}, this.state), newState);
    }
    resetState() {
        this.state = getDefaultState();
    }
}
var state = I18nStateManager.getInstance();

/**
 * function to return active i18n state
 *
 *  ===== USAGE =====
 * import { getState } from '@razorpay/i18nify';
 *
 * console.log(getState())
 *
 * @returns i18n state
 */
const getState = () => {
    return state.getState();
};
var getState$1 = withErrorBoundary(getState);

/**
 * Function to set and override the active state in i18nify SDK
 *
 * ===== USAGE =====
 * import { setState } from "@razorpay/i18nify";
 * setState({locale: 'en-US'})
 *
 * @param newState data to set in i18nState instance
 */
const setState = (newState) => {
    state.setState(newState);
};
var setState$1 = withErrorBoundary(setState);

/**
 * Function to reset the active state in i18nify SDK
 *
 * ===== USAGE =====
 * import { resetState } from "@razorpay/i18nify";
 * resetState()
 *
 * @param newState data to set in i18nState instance
 */
const resetState = () => {
    state.resetState();
};
var resetState$1 = withErrorBoundary(resetState);

const getLocale = () => {
    // Check if running in a non-browser environment (e.g., Node.js or older browsers).
    if (typeof navigator === 'undefined') {
        return 'en-IN';
    }
    // Check if the browser supports the Intl object and user language preferences.
    if (window.Intl &&
        typeof window.Intl === 'object' &&
        (window.navigator.languages || window.navigator.language)) {
        const userLocales = window.navigator.languages || [
            window.navigator.language,
        ];
        return userLocales[0];
    }
    // Fallback to a supported locale or the default locale.
    return 'en-IN';
};

const getIntlInstanceWithOptions = (options = {}) => {
    /** retrieve locale from below areas in order of preference
     * 1. options.locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    let locale = (options === null || options === void 0 ? void 0 : options.locale) || state.getState().locale;
    // If a specific locale is provided, use it; otherwise, use the browser's locale
    if (!locale) {
        locale = getLocale();
    }
    const intlOptions = (options === null || options === void 0 ? void 0 : options.intlOptions) ? Object.assign({}, options.intlOptions) : {};
    if ((options === null || options === void 0 ? void 0 : options.currency) || intlOptions.currency) {
        intlOptions.style = 'currency';
        intlOptions.currency = (options.currency || intlOptions.currency);
    }
    if (!locale)
        throw new Error('Pass valid locale !');
    return new Intl.NumberFormat(locale || undefined, intlOptions);
};

// this function formats number based on different arguments passed
const formatNumber = (amount, options = {}) => {
    if (!Number(amount) && Number(amount) !== 0)
        throw new Error('Parameter `amount` is not a number!');
    let formattedAmount = '';
    try {
        formattedAmount = getIntlInstanceWithOptions(options).format(Number(amount));
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    return formattedAmount;
};
var formatNumber$1 = withErrorBoundary(formatNumber);

const CURRENCIES = {
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

const getCurrencyList = () => {
    return CURRENCIES;
};
var getCurrencyList$1 = withErrorBoundary(getCurrencyList);

const getCurrencySymbol = (currencyCode) => {
    var _a;
    if (currencyCode in CURRENCIES)
        return (_a = CURRENCIES[currencyCode]) === null || _a === void 0 ? void 0 : _a.symbol;
    else
        throw new Error('Invalid currencyCode!');
};
var getCurrencySymbol$1 = withErrorBoundary(getCurrencySymbol);

const formatNumberByParts = (amount, options = {}) => {
    if (!Number(amount) && Number(amount) !== 0)
        throw new Error('Parameter `amount` is not a number!');
    try {
        const formattedAmount = getIntlInstanceWithOptions(options).formatToParts(Number(amount));
        const parts = formattedAmount;
        let integerValue = '';
        let decimalValue = '';
        let currencySymbol = '';
        let separator = '';
        let symbolAtFirst = true;
        const partValues = parts.map((p) => {
            if (p.type === 'integer' || p.type === 'group')
                integerValue += p.value;
            else if (p.type === 'fraction')
                decimalValue += p.value;
            else if (p.type === 'currency')
                currencySymbol += p.value;
            else if (p.type === 'decimal')
                separator += p.value;
            return p.value;
        });
        if (currencySymbol.toString() !== partValues[0].toString())
            symbolAtFirst = false;
        return {
            currencySymbol,
            decimalValue,
            integerValue,
            separator,
            symbolAtFirst,
        };
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
};
var formatNumberByParts$1 = withErrorBoundary(formatNumberByParts);

const PHONE_REGEX_MAPPER = {
    IN: /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/,
    MY: /^(\+?6?0)?(\d{1,3})[-. ]?(\d{7,8})$/,
    AE: /^(?:\+?971|0)?(?:2|3|4|6|7|9)\d{8}$/,
    AL: /^(?:\+?355)?(?:[4-9]\d{7}|6\d{8})$/,
    AM: /^(?:\+?374)?(?:[0-9]{8}|[0-9]{6}[0-9]{2})$/,
    AR: /^(?:(?:\+|0{0,2})54)?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/,
    AU: /^(?:\+?61|0)4\d{8}$/,
    AW: /^(?:(?:\+297)?(?!0)\d{7})$/,
    BB: /^(?:(?:\+1)?246)?(?:\d{3})?\d{7}$/,
    BD: /^(?:\+?880|0)1[13456789]\d{8}$/,
    BM: /^(?:(?:\+1)?441)?(?:\d{2})?\d{7}$/,
    BN: /^(?:\+?673)?(?:\d{3})?\d{4}$/,
    BO: /^(?:(?:\+|0{0,2})591)?(?:(?:2|3|7|6)\d{7})$/,
    BS: /^(?:(?:\+1)?242)?(?:\d{3})?\d{7}$/,
    BW: /^(?:(?:\+267)?\s?)?[74]\d{7}$/,
    BZ: /^(?:(?:\+501)?\s?)?[622]\d{4}$/,
    CH: /^(?:(?:\+41|0)(?:\s*\(?0\)?\s*))?(?:\d{2}\s*)?\d{3}\s*\d{2}\s*\d{2}$/,
    CN: /^(?:(?:\+|00)86)?1\d{10}$/,
    CO: /^(?:(?:\+57|0057)?)?[1-8]{1}\d{6,7}$/,
    OM: /^(?:\+?968)?(?:95|96|97|98)\d{6}$/,
    CR: /^(?:(?:\+506)?\s*|0)?[1-9]\d{7}$/,
    CU: /^(?:\+?53)?(?:[5-8]\d{7})$/,
    CZ: /^(?:\+?420)?(?:\d{9})$/,
    DK: /^(?:\+?45)?(?:\d{8})$/,
    DO: /^(?:(?:\+1)?809|1-8(?:00|88|89))(?:\d{7})$/,
    DZ: /^(?:\+?213|0)([567]\d{8})$/,
    EG: /^(?:(?:\+20|20)?(\d{10}))$/,
    ET: /^(?:\+?251)?[1-59]\d{8}$/,
    EU: /^(?:(?:\+?3)?8)?\s*(?:\d{3}\s*){3}\d{2}$/,
    FJ: /^(?:(?:\+?679)?\s?\d{3}\s?\d{4})?$/,
    GB: /^(?:(?:\+44\s?|0)7\d{3}(\s?\d{4,})?)$/,
    GH: /^(?:(?:\+233)|0)?(?:\d{9})$/,
    GI: /^(?:\+350)?\d{5}$/,
    GM: /^(?:\+220)?\d{5,7}$/,
    GT: /^(?:\+502)?[2468]\d{7,8}$/,
    GY: /^(?:(?:\+592)?(?:(?:\s)?[2-9])(?:(?:\s)?\d))?(?:(?:\s)?\d{4})$/,
    HK: /^(?:\+852\s?)?[456789]\d{3}\s?\d{4}$/,
    HN: /^(?:\+504)?[89]\d{7}$/,
    HR: /^(?:\+?385)?\d{8,9}$/,
    HT: /^(?:\+?509)?\d{8}$/,
    HU: /^(?:(?:\+36))(\s?\d{2}\s?\d{3}\s?\d{4})$/,
    ID: /^(?:\+?62|0[1-9])[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}$/,
    IL: /^(?:(?:\+972|0)(?:-)?)[23489]\d{7}$/,
    JM: /^(?:(?:\+1876))\d{7,10}$/,
    KE: /^(?:(?:\+254)|(?:0))(?:\d{6,7})$/,
    KG: /^(?:\+996)?\s?\d{9}$/,
    KH: /^(?:(?:\+855)|(?:0))(?:\s?[1-9]\d{7,8})$/,
    KY: /^(?:\+?1\s?(345))\d{6}$/,
    KZ: /^(?:\+?7|8)?7\d{9}$/,
    LA: /^(?:(?:\+?856)|0)(20\d{7,9})$/,
    LK: /^(?:(?:\+94)|0)(?:\d{9})$/,
    LR: /^(?:\+231)[ -\d]{4}[ -\d]{4}$/,
    LS: /^(?:(?:\+?266)|0)?[56]\d{7}$/,
    MA: /^(?:(?:\+?212(\s*[-|\s*]?\d{1,9})?)|(?:0))(?:\d{9})$/,
    MD: /^(?:(?:\+373)|(?:0))(?:\d{7,8})$/,
    MK: /^(?:\+389|0)(?:(?:2[0-4]|[3-9])\s?)?\d{6}$/,
    MM: /^(?:(?:\+?95)|0)?[1-9]\d{9}$/,
    MN: /^(?:\+976|0)\d{8}$/,
    MO: /^(?:(?:\+?853)|[0-9])?\d{8}$/,
    MU: /^(?:\+230|0)?\d{8}$/,
    MV: /^(?:(?:\+?960)|0)?\d{7}$/,
    MW: /^(?:\+265)[1-9]\d{6}$/,
    MX: /^(?:(?:\+?52)?\s?(?:1|01)?\s?)?(?:\d{3}\s?\d{3}\s?\d{4})$/,
    NA: /^(?:(?:\+264)|0)?\d{8}$/,
    NG: /^(?:(?:\+234)|(?:0))(?:\d{7,8})$/,
    NI: /^(?:(?:\+505))?(?:\d{8})$/,
    NO: /^(?:(?:\+?47)|\d{2}|\d{3})\s?\d{2}\s?\d{3}$/,
    NP: /^(?:(?:\+977))?(\d{9,10})$/,
    NZ: /^(?:\+?64|0)(\d{2,5} \d{4,8}|\d{3,4} \d{4})$/,
    PE: /^(?:(?:\+51)|0)?(?:9\d{8})$/,
    PG: /^(?:\+?675)?(?:[7-9]\d{7})$/,
    PH: /^(?:(?:\+?63)|0)(?:\d{10})$/,
    PK: /^(?:(?:\+92)|0)?[345]\d{9}$/,
    QA: /^(?:\+?974)?-?33\d{5}$/,
    RU: /^(?:\+?7|8)?[ -]?\(?9\d{2}\)?[ -]?\d{3}[ -]?\d{2}[ -]?\d{2}$/,
    SA: /^(?:\+?966)?\s?1?[\s-]?(?:[45]\d{2}|5\d{3})[\s-]?\d{4}$/,
    SC: /^(?:(?:\+248)|\d{4})\d{5}$/,
    SE: /^(?:\+?46|0)\s?[1-57-9](?:[0-9]\s?){8}$/,
    SG: /^(?:(?:\+65)|(?:\(\+65\))|(?:65))\d{4}\d{4}$/,
    SL: /^(?:(?:\+232)|(?:0))?\d{9}$/,
    SO: /^(?:\+252|0)?[567]\d{7}$/,
    SS: /^(?:\+211|0)?[1-9]\d{7,9}$/,
    SV: /^(?:(?:\+?503)|(?:0))(?:\d{8})$/,
    SZ: /^(?:\+?268)?\d{7,8}$/,
    TH: /^(?:(?:\+66)|0)\d{9}$/,
    TT: /^(?:(?:\+?1-868)|\(?868\)?)(\d{7})$/,
    TZ: /^(?:(?:\+?255)|0)?[67]\d{8}$/,
    US: /^(\+\d{1,2}\s?)?([2-9]{1}\d{2}[2-9]{1}\d{6})$/,
    CA: /^(\+\d{1,2}\s?)?([2-9]{1}\d{2}[2-9]{1}\d{6})$/,
    UY: /^(?:(?:\+598|0)\s?(9\d{3}|2\d{2}|[4-9]\d{6}))$/,
    UZ: /^(?:\+?998)?\s?[3456789]\d{8}$/,
    YE: /^(?:\+?967)?(?:\d{7,8})$/,
    ZA: /^(?:(?:\+27)|0)(\d{9})$/,
    KW: /^(?:\+?965)[569]\d{7}$/,
    BH: /^(?:\+?973)?[356]\d{7}$/,
    TL: /^(?:(?:\+670)\s?)?[0-9]{3}\s?[0-9]{3,4}$/,
    VC: /^(?:(?:\+1)?784)?(?:\d{3})?\d{7}$/,
    VE: /^(?:(?:\+58)|0)?4\d{9}$/,
    VN: /^(?:(?:\+84)|0)?[1-9]\d{8}$/,
    ZM: /^(?:(?:\+260)|0)?[123456789]\d{8,9}$/,
    ZW: /^(?:(?:\+263)|0)?(?:\d{9,10})$/,
    LT: /^(?:(?:\+370)|8)\d{8}$/,
    LU: /^(?:(?:\+352)?(6|2(6|7|8|9))\d{6})$/,
    LV: /^(?:(?:\+371)?2\d{7})$/,
    ME: /^(?:(?:\+382)?[67]\d{7,20})$/,
    MG: /^(?:(?:\+261)?3[234568]\d{7})$/,
    MZ: /^(?:(?:\+258)|(?:258))?8[234567]\d{7,8}$/,
    NL: /^(?:(?:\+31)|0(6(?:\d{8})|[1-9](?:(?:\d{8})|(?:\s\d{3}\s\d{4}))|(?:\d{8})))$/,
    PA: /^(?:(?:\+507)\s?)?[46]\d{6,7}$/,
    PL: /^(?:(?:\+48)?(?:\s?\d{3}\s?\d{3}\s?\d{3}|(?:\d{2}\s?){4}\d{2}|\d{3}-\d{3}-\d{3}))$/,
    PR: /^(?:(?:\+1)?787|939)\d{7}$/,
    PS: /^(?:(?:\+970))(5[2349])\d{7}$/,
    PT: /^(?:(?:\+351)?9(1\d|2[1-9]|6[12345789]|7[12345789])\d{7})$/,
    PY: /^(?:(?:\+595|0)9[9876]\d{7})$/,
    RO: /^(?:(?:\+40|0))(?:7[2-8]\d{7}|21\d{8})$/,
    RS: /^(?:(?:\+381)|0)([0-6]|[7][012345])[0-9]{5,10}$/,
    RW: /^(?:(?:\+250)|(0))\d{9}$/,
    SI: /^(?:(?:\+386)|0)?[1-59]\d{7,8}$/,
    SK: /^(?:(?:\+421))?(0|9[0-8])\d{8}$/,
    SM: /^(?:(?:\+378)|(0549|6\d{4}))\d{5}$/,
    SN: /^(?:(?:\+221)|0)?[3679]\d{7}$/,
    SR: /^(?:(?:\+597))\d{7}$/,
    TG: /^(?:(?:\+228))\d{8}$/,
    TJ: /^(?:(?:\+992))(37|55|77)\d{7}$/,
    TN: /^(?:(?:\+216)|22|9[1-9])\d{7}$/,
    TR: /^(?:(?:\+90)|(0))\s?5\d{9}$/,
    TW: /^(?:(?:\+886)|0)?9\d{8}$/,
    UA: /^(?:(?:\+380)|(0))?(39|50|63|66|67|68|91|92|93|94|95|96|97|98|99)\d{7}$/,
    UG: /^(?:(?:\+256)|0)?[39]\d{8}$/,
};

/*  Source: Google LibPhoneNumber Metadata: https://github.com/google/libphonenumber/blob/master/javascript/i18n/phonenumbers/metadata.js  */
const DIAL_CODE_MAPPER = {
    1: [
        'US',
        'AG',
        'AI',
        'AS',
        'BB',
        'BM',
        'BS',
        'CA',
        'DM',
        'DO',
        'GD',
        'GU',
        'JM',
        'KN',
        'KY',
        'LC',
        'MP',
        'MS',
        'PR',
        'SX',
        'TC',
        'TT',
        'VC',
        'VG',
        'VI',
    ],
    7: ['RU', 'KZ'],
    20: ['EG'],
    27: ['ZA'],
    30: ['GR'],
    31: ['NL'],
    32: ['BE'],
    33: ['FR'],
    34: ['ES'],
    36: ['HU'],
    39: ['IT', 'VA'],
    40: ['RO'],
    41: ['CH'],
    43: ['AT'],
    44: ['GB', 'GG', 'IM', 'JE'],
    45: ['DK'],
    46: ['SE'],
    47: ['NO', 'SJ'],
    48: ['PL'],
    49: ['DE'],
    51: ['PE'],
    52: ['MX'],
    53: ['CU'],
    54: ['AR'],
    55: ['BR'],
    56: ['CL'],
    57: ['CO'],
    58: ['VE'],
    60: ['MY'],
    61: ['AU', 'CC', 'CX'],
    62: ['ID'],
    63: ['PH'],
    64: ['NZ'],
    65: ['SG'],
    66: ['TH'],
    81: ['JP'],
    82: ['KR'],
    84: ['VN'],
    86: ['CN'],
    90: ['TR'],
    91: ['IN'],
    92: ['PK'],
    93: ['AF'],
    94: ['LK'],
    95: ['MM'],
    98: ['IR'],
    211: ['SS'],
    212: ['MA', 'EH'],
    213: ['DZ'],
    216: ['TN'],
    218: ['LY'],
    220: ['GM'],
    221: ['SN'],
    222: ['MR'],
    223: ['ML'],
    224: ['GN'],
    225: ['CI'],
    226: ['BF'],
    227: ['NE'],
    228: ['TG'],
    229: ['BJ'],
    230: ['MU'],
    231: ['LR'],
    232: ['SL'],
    233: ['GH'],
    234: ['NG'],
    235: ['TD'],
    236: ['CF'],
    237: ['CM'],
    238: ['CV'],
    239: ['ST'],
    240: ['GQ'],
    241: ['GA'],
    242: ['CG'],
    243: ['CD'],
    244: ['AO'],
    245: ['GW'],
    246: ['IO'],
    247: ['AC'],
    248: ['SC'],
    249: ['SD'],
    250: ['RW'],
    251: ['ET'],
    252: ['SO'],
    253: ['DJ'],
    254: ['KE'],
    255: ['TZ'],
    256: ['UG'],
    257: ['BI'],
    258: ['MZ'],
    260: ['ZM'],
    261: ['MG'],
    262: ['RE', 'YT'],
    263: ['ZW'],
    264: ['NA'],
    265: ['MW'],
    266: ['LS'],
    267: ['BW'],
    268: ['SZ'],
    269: ['KM'],
    290: ['SH', 'TA'],
    291: ['ER'],
    297: ['AW'],
    298: ['FO'],
    299: ['GL'],
    350: ['GI'],
    351: ['PT'],
    352: ['LU'],
    353: ['IE'],
    354: ['IS'],
    355: ['AL'],
    356: ['MT'],
    357: ['CY'],
    358: ['FI', 'AX'],
    359: ['BG'],
    370: ['LT'],
    371: ['LV'],
    372: ['EE'],
    373: ['MD'],
    374: ['AM'],
    375: ['BY'],
    376: ['AD'],
    377: ['MC'],
    378: ['SM'],
    380: ['UA'],
    381: ['RS'],
    382: ['ME'],
    383: ['XK'],
    385: ['HR'],
    386: ['SI'],
    387: ['BA'],
    389: ['MK'],
    420: ['CZ'],
    421: ['SK'],
    423: ['LI'],
    500: ['FK'],
    501: ['BZ'],
    502: ['GT'],
    503: ['SV'],
    504: ['HN'],
    505: ['NI'],
    506: ['CR'],
    507: ['PA'],
    508: ['PM'],
    509: ['HT'],
    590: ['GP', 'BL', 'MF'],
    591: ['BO'],
    592: ['GY'],
    593: ['EC'],
    594: ['GF'],
    595: ['PY'],
    596: ['MQ'],
    597: ['SR'],
    598: ['UY'],
    599: ['CW', 'BQ'],
    670: ['TL'],
    672: ['NF'],
    673: ['BN'],
    674: ['NR'],
    675: ['PG'],
    676: ['TO'],
    677: ['SB'],
    678: ['VU'],
    679: ['FJ'],
    680: ['PW'],
    681: ['WF'],
    682: ['CK'],
    683: ['NU'],
    685: ['WS'],
    686: ['KI'],
    687: ['NC'],
    688: ['TV'],
    689: ['PF'],
    690: ['TK'],
    691: ['FM'],
    692: ['MH'],
    800: ['001'],
    808: ['001'],
    850: ['KP'],
    852: ['HK'],
    853: ['MO'],
    855: ['KH'],
    856: ['LA'],
    870: ['001'],
    878: ['001'],
    880: ['BD'],
    881: ['001'],
    882: ['001'],
    883: ['001'],
    886: ['TW'],
    888: ['001'],
    960: ['MV'],
    961: ['LB'],
    962: ['JO'],
    963: ['SY'],
    964: ['IQ'],
    965: ['KW'],
    966: ['SA'],
    967: ['YE'],
    968: ['OM'],
    970: ['PS'],
    971: ['AE'],
    972: ['IL'],
    973: ['BH'],
    974: ['QA'],
    975: ['BT'],
    976: ['MN'],
    977: ['NP'],
    979: ['001'],
    992: ['TJ'],
    993: ['TM'],
    994: ['AZ'],
    995: ['GE'],
    996: ['KG'],
    998: ['UZ'],
};

/**
 * Determines the country code based on the provided phone number.
 * This function employs a multi-step approach to identify the country code:
 * - If the phone number starts with '+', it extracts the numeric characters
 *   and matches the leading digits with known dial codes mapped to countries.
 * - For matched dial codes, it further filters based on country-specific regex patterns
 *   to validate the phone number format for those countries.
 * - If the phone number doesn't start with '+', it directly matches the number
 *   against regular expressions associated with various countries to identify the code.
 *
 * @param phoneNumber The input phone number (string or number).
 * @returns The detected country code or an empty string if not found.
 */
const detectCountryCodeFromDialCode = (phoneNumber) => {
    // If the phone number starts with '+', extract numeric characters
    if (phoneNumber.toString().charAt(0) === '+') {
        const cleanedPhoneNumberWithoutPlusPrefix = phoneNumber
            .toString()
            .replace(/\D/g, '');
        const matchingCountries = [];
        // Iterate through dial codes and check for matches with cleaned phone number
        for (const code in DIAL_CODE_MAPPER) {
            if (cleanedPhoneNumberWithoutPlusPrefix.startsWith(code)) {
                matchingCountries.push(...DIAL_CODE_MAPPER[code]);
            }
        }
        // Filter matching countries based on phone number validation regex
        const matchedCountryCode = matchingCountries.find((countryCode) => {
            const regex = PHONE_REGEX_MAPPER[countryCode];
            if (regex && regex.test(phoneNumber.toString()))
                return countryCode;
            return undefined;
        });
        // Return the first matched country code, if any
        return matchedCountryCode || '';
    }
    else {
        // If phone number doesn't start with '+', directly match against country regexes
        for (const countryCode in PHONE_REGEX_MAPPER) {
            const regex = PHONE_REGEX_MAPPER[countryCode];
            if (regex.test(phoneNumber.toString())) {
                return countryCode;
            }
        }
    }
    // Return empty string if no country code is detected
    return '';
};
const cleanPhoneNumber = (phoneNumber) => {
    // Regular expression to match all characters except numbers and + sign at the start
    const regex = /[^0-9+]|(?!A)\+/g;
    // Replace matched characters with an empty string
    const cleanedPhoneNumber = phoneNumber.replace(regex, '');
    return phoneNumber[0] === '+' ? `+${cleanedPhoneNumber}` : cleanedPhoneNumber;
};

// Validates whether a given phone number is valid based on the provided country code or auto-detects the country code and checks if the number matches the defined regex pattern for that country.
const isValidPhoneNumber = (phoneNumber, countryCode) => {
    // Clean the provided phoneNumber by removing non-numeric characters
    const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber.toString());
    // Detect or validate the country code
    countryCode =
        countryCode && countryCode in PHONE_REGEX_MAPPER
            ? countryCode
            : detectCountryCodeFromDialCode(cleanedPhoneNumber);
    // Return false if phoneNumber is empty
    if (!phoneNumber)
        return false;
    // Check if the countryCode exists in the PHONE_REGEX_MAPPER
    if (countryCode in PHONE_REGEX_MAPPER) {
        // Fetch the regex pattern for the countryCode
        const regex = PHONE_REGEX_MAPPER[countryCode];
        // Test if the cleanedPhoneNumber matches the regex pattern
        return regex.test(cleanedPhoneNumber);
    }
    // Return false if the countryCode is not supported
    return false;
};
var isValidPhoneNumber$1 = withErrorBoundary(isValidPhoneNumber);

const PHONE_FORMATTER_MAPPER = {
    IN: 'xxxx xxxxxx',
    MY: 'xx xxxxx xx',
    AE: 'xx xxx xxxx',
    AL: 'xxx xx xxxx',
    AM: 'xx xx xx xx',
    AR: 'xxxx-xxxx',
    AU: 'xxx xxx xxx',
    AW: 'xxx-xxxx',
    BB: 'xxx-xxxx',
    BD: 'xxxx-xxxxxx',
    BM: 'xxx-xxxx',
    BN: 'xxxx-xxxx',
    BO: 'xxxx-xxxx',
    BS: 'xxx-xxxx',
    BW: 'xx xxxx xxxx',
    BZ: 'xxx-xxxx',
    CA: 'xxx-xxx-xxxx',
    CH: 'xxx xxx xxx',
    CN: 'xxxx-xxxxxxx',
    CO: 'xxxx-xxxxxxx',
    CR: 'xxxx-xxxx',
    CU: 'xxxx-xxxx',
    CZ: 'xxx xxx xxx',
    DK: 'xx xx xx xx',
    DO: 'xxx-xxxxxxx',
    DZ: 'xxxx-xxxx-xxx',
    EG: 'xx xxx xxxx',
    ET: 'xx xxx xxxx',
    EU: 'xxx xx xx xx',
    FJ: 'xxxx xxxx',
    GB: 'xxxx xxx xxx',
    GH: 'xxx xxx xxxx',
    GI: 'xxxx xxxx',
    GM: 'xxxx-xxxx',
    GT: 'xxxx-xxxx',
    GY: 'xxx-xxxx',
    HK: 'xxxx xxxx',
    HN: 'xxxx-xxxx',
    HR: 'xxx xxx xxxx',
    HT: 'xxx-xxxx',
    HU: 'xxx xxx xxxx',
    ID: 'xxxx-xxxx-xxxx',
    IL: 'xxxx-xxx-xxx',
    JM: 'xxx-xxxx',
    KE: 'xxx xxxxxx',
    KG: 'xxx-xx-xx-xx',
    KH: 'xxx-xxx-xxx',
    KY: 'xxx-xxxx',
    KZ: 'xxx-xxx-xx-xx',
    LA: 'xxx xx xxxx',
    LK: 'xx xxx xxxx',
    LR: 'xxx-xxx-xxxx',
    LS: 'xxx xx xxxx',
    LT: 'xxx xxxxx',
    LU: 'xxx xx xxx',
    LV: 'xxxx xxxx',
    MA: 'xxxx-xxxxxx',
    MD: 'xx xxxxxx',
    ME: 'xx xxxxxx',
    MG: 'xx xx xx xx xx',
    MK: 'xx xx xx xx',
    MM: 'xx xxxxxx',
    MN: 'xxx-xx-xxxx',
    MO: 'xxxx xxxx',
    MU: 'xx xxxx xxxx',
    MV: 'xxxxxx',
    MW: 'xx xxxx xxxx',
    MX: 'xxx-xxx-xxxx',
    MZ: 'xx xxxxxxx',
    NA: 'xx xxxx xxxx',
    NG: 'xxx xxx xxxx',
    NI: 'xxxx-xxxx',
    NL: 'xxx-xxxxxxx',
    NO: 'xxxx xxxx',
    NP: 'xxxx-xxxxxxx',
    NZ: 'xxx-xxxxxxx',
    OM: 'xxxx-xxxx',
    PA: 'xxx-xxxx',
    PE: 'xxx-xxx-xxx',
    PG: 'xxx-xxxxxx',
    PH: 'xxx-xxxx',
    PK: 'xxx-xxxxxxx',
    PL: 'xxx xxx xxx',
    PR: 'xxx-xxx-xxxx',
    PS: 'xxxx-xxxxxxx',
    PT: 'xxx xxx xxx',
    PY: 'xxx-xxxxxx',
    QA: 'xxxx xxxx',
    RO: 'xxx xxx xxxx',
    RS: 'xxx xxxxx',
    RU: 'xxx xxx-xx-xx',
    RW: 'xxx xxxxxx',
    SA: 'xxx-xxxxxxx',
    SC: 'xx xxxxx',
    SE: 'xxx-xxx xx xx',
    SG: 'xxxx xxxx',
    SI: 'xx xxxxxx',
    SK: 'xxx xxx xxx',
    SL: 'xxx-xxxxxx',
    SM: 'xxxxx xxxxx',
    SN: 'xx xxx xx xx',
    SO: 'xxx xxxxxxx',
    SR: 'xxx-xxxx',
    SS: 'xxx xxxx xxx',
    SV: 'xxxx-xxxx',
    SZ: 'xxx xx xxxx',
    TG: 'xx xx xx xx',
    TH: 'xxx-xxxxxxx',
    TJ: 'xxx xx xx xx',
    TL: 'xxx-xxxxxxx',
    TN: 'xx xxxxxx',
    TR: 'xxx xxx xx xx',
    TT: 'xxx-xxxx',
    TW: 'xxxx-xxxxxx',
    TZ: 'xxx xxx xxxx',
    UA: 'xx xxx xx xx',
    UG: 'xxx xxxxxxx',
    US: 'xxx-xxx-xxxx',
    UY: 'xxx-xxxxx',
    UZ: 'xxx-xxx-xx-xx',
    VC: 'xxx-xxxx',
    VE: 'xxxx-xxx-xxxx',
    VN: 'xxxx-xxxxxxx',
    YE: 'xxxx-xxxx',
    ZA: 'xxx-xxx-xxxx',
    ZM: 'xxx-xxxxxxx',
    ZW: 'xx xxx xxxx',
    KW: 'xxx xx xxxx',
    BH: 'xxxx xxxx',
};

// Formats a provided phone number according to the predefined format for a specific country code, or auto-detects the country code and formats the number accordingly.
const formatPhoneNumber = (phoneNumber, countryCode) => {
    // Throw errors if phoneNumber is invalid
    if (!phoneNumber)
        throw new Error('Parameter `phoneNumber` is invalid!');
    // Convert phoneNumber to string and clean it by removing non-numeric characters
    phoneNumber = phoneNumber.toString();
    phoneNumber = cleanPhoneNumber(phoneNumber);
    // Detect or validate the country code
    countryCode =
        countryCode && countryCode in PHONE_FORMATTER_MAPPER
            ? countryCode
            : detectCountryCodeFromDialCode(phoneNumber);
    // Fetch the pattern for the countryCode from the PHONE_FORMATTER_MAPPER
    const pattern = PHONE_FORMATTER_MAPPER[countryCode];
    if (!pattern)
        return phoneNumber;
    // Count the number of 'x' characters in the format pattern
    let charCountInFormatterPattern = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 'x') {
            charCountInFormatterPattern++;
        }
    }
    // Calculate the difference between phoneNumber length and 'x' characters count in pattern
    const diff = phoneNumber.length - charCountInFormatterPattern;
    // Extract the phoneNumber without the prefix
    const phoneNumberWithoutPrefix = phoneNumber.slice(diff);
    const formattedNumber = [];
    let numberIndex = 0;
    // Loop through the pattern to format the phoneNumber
    for (let i = 0; i < pattern.length; i++) {
        const patternChar = pattern[i];
        if (patternChar === 'x') {
            // Insert phoneNumber digits at 'x' positions
            if (numberIndex < phoneNumberWithoutPrefix.length) {
                formattedNumber.push(phoneNumberWithoutPrefix[numberIndex]);
                numberIndex++;
            }
        }
        else {
            // Insert non-digit characters from the pattern
            formattedNumber.push(patternChar);
        }
    }
    // Join the formattedNumber array to create the formattedPhoneNumber without prefix
    const formattedPhoneNumberWithoutPrefix = formattedNumber.join('');
    // Combine the prefix and formattedPhoneNumberWithoutPrefix
    const formattedPhoneNumberWithPrefix = phoneNumber.slice(0, diff) + ' ' + formattedPhoneNumberWithoutPrefix;
    // Return the formattedPhoneNumber with prefix after trimming whitespace
    return formattedPhoneNumberWithPrefix.trim();
};
var formatPhoneNumber$1 = withErrorBoundary(formatPhoneNumber);

// Parses a given phone number, identifies its country code (if not provided), and returns an object with details including the country code, formatted phone number, dial code, and format template.
const parsePhoneNumber = (phoneNumber, country) => {
    // Throw errors if phoneNumber is invalid
    if (!phoneNumber)
        throw new Error('Parameter `phoneNumber` is invalid!');
    // Clean the phoneNumber by removing non-numeric characters
    phoneNumber = phoneNumber.toString();
    phoneNumber = cleanPhoneNumber(phoneNumber);
    // Detect or validate the country code
    const countryCode = country && country in PHONE_FORMATTER_MAPPER
        ? country
        : detectCountryCodeFromDialCode(phoneNumber);
    // Format the phone number using the detected/validated country code
    const formattedPhoneNumber = formatPhoneNumber$1(phoneNumber, countryCode);
    // Fetch the pattern associated with the countryCode from the PHONE_FORMATTER_MAPPER
    const pattern = PHONE_FORMATTER_MAPPER[countryCode];
    if (!pattern)
        return {
            countryCode: countryCode || '',
            dialCode: '',
            formattedPhoneNumber: phoneNumber,
            formatTemplate: '',
        };
    // Count the number of 'x' characters in the format pattern
    let charCountInFormatterPattern = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 'x') {
            charCountInFormatterPattern++;
        }
    }
    // Calculate the difference between phoneNumber length and 'x' characters count in pattern
    const diff = phoneNumber.length - charCountInFormatterPattern;
    // Extract the dialCode from the phoneNumber
    const dialCode = phoneNumber.slice(0, diff);
    // Obtain the format template associated with the countryCode
    const formatTemplate = PHONE_FORMATTER_MAPPER[countryCode];
    // Return the parsed phone number information
    return {
        countryCode,
        formattedPhoneNumber,
        dialCode,
        formatTemplate,
    };
};
var parsePhoneNumber$1 = withErrorBoundary(parsePhoneNumber);

// Call the loadPolyfills function
loadPolyfills()
    .then(() => {
    // Polyfills loaded successfully
    console.info('Polyfills loaded successfully!');
})
    .catch((error) => {
    // Handle any errors that occurred while loading polyfills
    console.error('Error loading polyfills:', error);
});

// Function to map custom type to Intl.NumberFormatPart
function mapToNumberFormatPart(parts) {
    // Map the custom number format parts to the standard Intl.NumberFormatPart
    return parts.map((part) => ({
        type: part.type,
        value: part.value,
    }));
}
// Export a default function for the Intl polyfill
function intlFormatToPartsPolyfill() {
    // Check if the formatToParts method is not defined
    if (!Intl.NumberFormat.prototype.formatToParts) {
        // Define the formatToParts method as a polyfill for environments that lack it
        Object.defineProperty(Intl.NumberFormat.prototype, 'formatToParts', {
            value: function (number) {
                // Check if the input is a valid number
                if (typeof number !== 'number') {
                    throw new TypeError('Argument should be a valid number');
                }
                // Format the number using the available formatting
                const formattedNumber = this.format(number);
                const parts = [];
                // Use regex to match string and number parts in the formatted output
                const regex = /(\D+)|(\d+)/g;
                let match;
                while ((match = regex.exec(formattedNumber)) !== null) {
                    // Determine the type of the matched part (string or integer)
                    const type = match[1]
                        ? 'string'
                        : 'integer';
                    parts.push({
                        type,
                        value: match[0],
                    });
                }
                // Map the custom parts to standard Intl.NumberFormatPart
                return mapToNumberFormatPart(parts);
            },
            writable: true,
            configurable: true,
        });
    }
}

var intlFormatToPartsPolyfill$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: intlFormatToPartsPolyfill
});

export { formatNumber$1 as formatNumber, formatNumberByParts$1 as formatNumberByParts, formatPhoneNumber$1 as formatPhoneNumber, getCurrencyList$1 as getCurrencyList, getCurrencySymbol$1 as getCurrencySymbol, getState$1 as getState, isValidPhoneNumber$1 as isValidPhoneNumber, parsePhoneNumber$1 as parsePhoneNumber, resetState$1 as resetState, setState$1 as setState };
//# sourceMappingURL=index.js.map
