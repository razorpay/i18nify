'use strict';

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
 * import { getState } from '@razorpay/i18nify-js';
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
 * import { setState } from "@razorpay/i18nify-js";
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
 * import { resetState } from "@razorpay/i18nify-js";
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

const ALLOWED_FORMAT_PARTS_KEYS = [
    'nan',
    'infinity',
    'percent',
    'integer',
    'group',
    'decimal',
    'fraction',
    'plusSign',
    'minusSign',
    'percentSign',
    'currency',
    'code',
    'symbol',
    'name',
    'compact',
    'exponentInteger',
    'exponentMinusSign',
    'exponentSeparator',
    'unit',
];

const formatNumberByParts = (amount, options = {}) => {
    if (!Number(amount) && Number(amount) !== 0)
        throw new Error('Parameter `amount` is not a number!');
    try {
        const formattedAmount = getIntlInstanceWithOptions(options).formatToParts(Number(amount));
        const parts = formattedAmount;
        const formattedObj = {};
        parts.forEach((p) => {
            if (p.type === 'group') {
                formattedObj.integer = (formattedObj.integer || '') + p.value;
            }
            else if (ALLOWED_FORMAT_PARTS_KEYS.findIndex((item) => item === p.type) != -1) {
                // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal' is skipped
                formattedObj[p.type] = (formattedObj[p.type] || '') + p.value;
            }
        });
        return Object.assign(Object.assign({}, formattedObj), { isPrefixSymbol: parts[0].type === 'currency', rawParts: parts });
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

/**
 * Adds a specified amount of time to a date.
 *
 * @param date The original date.
 * @param value The amount to add.
 * @param unit The unit of time to add (e.g., 'days', 'months', 'years').
 * @returns A new Date object with the time added.
 */
const add = (date, value, unit) => {
    const result = new Date(date);
    switch (unit) {
        case 'days':
            result.setDate(result.getDate() + value);
            break;
        case 'months':
            result.setMonth(result.getMonth() + value);
            break;
        case 'years':
            result.setFullYear(result.getFullYear() + value);
            break;
    }
    return result;
};
var add$1 = withErrorBoundary(add);

/**
 * Formats date and time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string.
 * @param {DateTimeFormatOptions} options - Intl.DateTimeFormat options (optional).
 * @returns {string} Formatted date and time string.
 */
const formatDateTime = (date, locale, options = {}) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    const dateObj = date instanceof Date ? date : new Date(date);
    let formatter;
    try {
        formatter = new Intl.DateTimeFormat(locale, options);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    return formatter.format(dateObj);
};
var formatDateTime$1 = withErrorBoundary(formatDateTime);

/**
 * Formats date based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string.
 * @param {DateFormatOptions} options - Intl.DateTimeFormat options for date formatting (optional).
 * @returns {string} Formatted date string.
 */
const formatDate = (date, locale, options = {}) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    const fullOptions = Object.assign(Object.assign({}, options), { timeStyle: undefined });
    let formattedDate;
    try {
        formattedDate = formatDateTime$1(date, locale, fullOptions);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    return formattedDate;
};
var formatDate$1 = withErrorBoundary(formatDate);

/**
 * Formats time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string.
 * @param {TimeFormatOptions} options - Intl.DateTimeFormat options for time formatting (optional).
 * @returns {string} Formatted time string.
 */
const formatTime = (date, locale, options = {}) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    const fullOptions = Object.assign(Object.assign({}, options), { dateStyle: undefined });
    let formattedTime;
    try {
        formattedTime = formatDateTime$1(date, locale, fullOptions);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    return formattedTime;
};
var formatTime$1 = withErrorBoundary(formatTime);

/**
 * Gets the first day of the week for a given locale.
 *
 * @param locale The locale to determine the first day of the week for.
 * @returns The first day of the week (0-6, where 0 is Sunday).
 */
const getFirstDayOfWeek = (locale) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    let formatted;
    try {
        const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
        const sampleDate = new Date(2000, 0, 2); // A Sunday
        formatted = formatter.format(sampleDate);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    return ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'].indexOf(formatted.slice(0, 2).toLowerCase());
};
var getFirstDayOfWeek$1 = withErrorBoundary(getFirstDayOfWeek);

/**
 * Determines the quarter of the year for a given date.
 *
 * @param date The date to determine the quarter for.
 * @returns The quarter of the year (1-4).
 */
const getQuarter = (date) => {
    return Math.ceil((date.getMonth() + 1) / 3);
};
var getQuarter$1 = withErrorBoundary(getQuarter);

/**
 * Provides a relative time string (e.g., '3 hours ago', 'in 2 days').
 * This function calculates the difference between the given date and the base date,
 * then formats it in a locale-sensitive manner. It allows customization of the output
 * through Intl.RelativeTimeFormat options.
 *
 * @param date - The date to compare.
 * @param baseDate - The date to compare against (default: current date).
 * @param locale - The locale to use for formatting.
 * @param options - Options for the Intl.RelativeTimeFormat (optional).
 * @returns The relative time as a string.
 */
const getRelativeTime = (date, baseDate = new Date(), locale, options) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    const diffInSeconds = (date.getTime() - baseDate.getTime()) / 1000;
    // Define time units in seconds
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;
    let value;
    let unit;
    if (Math.abs(diffInSeconds) < minute) {
        value = diffInSeconds;
        unit = 'second';
    }
    else if (Math.abs(diffInSeconds) < hour) {
        value = diffInSeconds / minute;
        unit = 'minute';
    }
    else if (Math.abs(diffInSeconds) < day) {
        value = diffInSeconds / hour;
        unit = 'hour';
    }
    else if (Math.abs(diffInSeconds) < week) {
        value = diffInSeconds / day;
        unit = 'day';
    }
    else if (Math.abs(diffInSeconds) < month) {
        value = diffInSeconds / week;
        unit = 'week';
    }
    else if (Math.abs(diffInSeconds) < year) {
        value = diffInSeconds / month;
        unit = 'month';
    }
    else {
        value = diffInSeconds / year;
        unit = 'year';
    }
    let relativeTime;
    try {
        const rtf = new Intl.RelativeTimeFormat(locale, options);
        relativeTime = rtf.format(Math.round(value), unit);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    return relativeTime;
};
var getRelativeTime$1 = withErrorBoundary(getRelativeTime);

/**
 * Calculates the week number of the year for a given date.
 *
 * @param date The date to calculate the week number for.
 * @returns The week number of the year.
 */
const getWeek = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
var getWeek$1 = withErrorBoundary(getWeek);

/**
 * Returns an array of weekdays according to the specified locale.
 *
 * @param locale The locale to get weekdays for.
 * @returns An array of weekday names.
 */
const getWeekdays = (locale) => {
    try {
        /** retrieve locale from below areas in order of preference
         * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
         * 2. i18nState.locale (uses locale set globally)
         * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
         * */
        if (!locale)
            locale = state.getState().locale || getLocale();
        const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
        return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(1970, 0, 4 + i)));
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
var getWeekdays$1 = withErrorBoundary(getWeekdays);

/**
 * Compares two dates to determine if the first is after the second.
 * @param {DateInput} date1 - First date object or date string.
 * @param {DateInput} date2 - Second date object or date string.
 * @returns {boolean} True if date1 is after date2.
 */
const isAfter = (date1, date2) => {
    const dateObj1 = date1 instanceof Date ? date1 : new Date(date1);
    const dateObj2 = date2 instanceof Date ? date2 : new Date(date2);
    return dateObj1 > dateObj2;
};
var isAfter$1 = withErrorBoundary(isAfter);

/**
 * Compares two dates to determine if the first is before the second.
 * @param {DateInput} date1 - First date object or date string.
 * @param {DateInput} date2 - Second date object or date string.
 * @returns {boolean} True if date1 is before date2.
 */
const isBefore = (date1, date2) => {
    const dateObj1 = date1 instanceof Date ? date1 : new Date(date1);
    const dateObj2 = date2 instanceof Date ? date2 : new Date(date2);
    return dateObj1 < dateObj2;
};
var isBefore$1 = withErrorBoundary(isBefore);

/**
 * Checks if a given year is a leap year.
 *
 * @param year The year to check.
 * @returns True if the year is a leap year, false otherwise.
 */
const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
var isLeapYear$1 = withErrorBoundary(isLeapYear);

/**
 * Checks if two dates fall on the same day.
 *
 * @param date1 The first date.
 * @param date2 The second date.
 * @returns True if both dates are on the same day, false otherwise.
 */
const isSameDay = (date1, date2) => {
    return (date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear());
};
var isSameDay$1 = withErrorBoundary(isSameDay);

/**
 * Checks if a given object is a valid Date object.
 *
 * @param date The object to check.
 * @returns True if the object is a valid Date, false otherwise.
 */
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
};
var isValidDate$1 = withErrorBoundary(isValidDate);

const LOCALE_DATE_FORMATS = {
    'ar-AE': 'DD/MM/YYYY',
    'sq-AL': 'DD.MM.YYYY',
    'hy-AM': 'DD.MM.YYYY',
    'es-AR': 'DD/MM/YYYY',
    'en-AU': 'DD/MM/YYYY',
    'nl-AW': 'DD-MM-YYYY',
    'en-BB': 'MM/DD/YYYY',
    'bn-BD': 'DD/MM/YYYY',
    'en-BM': 'MM/DD/YYYY',
    'ms-BN': 'DD/MM/YYYY',
    'es-BO': 'DD/MM/YYYY',
    'en-BS': 'MM/DD/YYYY',
    'en-BW': 'DD/MM/YYYY',
    'en-BZ': 'MM/DD/YYYY',
    'en-CA': 'DD/MM/YYYY',
    'de-CH': 'DD.MM.YYYY',
    'zh-CN': 'YYYY/MM/DD',
    'es-CO': 'DD/MM/YYYY',
    'es-CR': 'DD/MM/YYYY',
    'es-CU': 'DD/MM/YYYY',
    'cs-CZ': 'DD.MM.YYYY',
    'da-DK': 'DD-MM-YYYY',
    'es-DO': 'DD/MM/YYYY',
    'ar-DZ': 'DD/MM/YYYY',
    'ar-EG': 'DD/MM/YYYY',
    'am-ET': 'DD/MM/YYYY',
    'en-EU': 'DD/MM/YYYY',
    'en-FJ': 'DD/MM/YYYY',
    'en-GB': 'DD/MM/YYYY',
    'en-GH': 'DD/MM/YYYY',
    'en-GI': 'DD/MM/YYYY',
    'en-GM': 'DD/MM/YYYY',
    'es-GT': 'DD/MM/YYYY',
    'en-GY': 'DD/MM/YYYY',
    'en-HK': 'DD/MM/YYYY',
    'es-HN': 'DD/MM/YYYY',
    'hr-HR': 'DD.MM.YYYY',
    'ht-HT': 'MM/DD/YYYY',
    'hu-HU': 'YYYY. MM. DD.',
    'id-ID': 'DD/MM/YYYY',
    'he-IL': 'DD/MM/YYYY',
    'en-IN': 'DD-MM-YYYY',
    'en-JM': 'MM/DD/YYYY',
    'en-KE': 'DD/MM/YYYY',
    'ky-KG': 'DD.MM.YYYY',
    'km-KH': 'DD/MM/YYYY',
    'en-KY': 'MM/DD/YYYY',
    'kk-KZ': 'DD.MM.YYYY',
    'lo-LA': 'DD/MM/YYYY',
    'si-LK': 'YYYY-MM-DD',
    'en-LR': 'MM/DD/YYYY',
    'en-LS': 'DD/MM/YYYY',
    'ar-MA': 'DD/MM/YYYY',
    'ro-MD': 'DD.MM.YYYY',
    'mk-MK': 'DD.MM.YYYY',
    'my-MM': 'DD/MM/YYYY',
    'mn-MN': 'YYYY.MM.DD',
    'zh-MO': 'DD/MM/YYYY',
    'en-MU': 'DD/MM/YYYY',
    'dv-MV': 'DD/MM/YYYY',
    'en-MW': 'DD/MM/YYYY',
    'es-MX': 'DD/MM/YYYY',
    'ms-MY': 'DD/MM/YYYY',
    'en-NA': 'DD/MM/YYYY',
    'en-NG': 'DD/MM/YYYY',
    'es-NI': 'DD/MM/YYYY',
    'no-NO': 'DD.MM.YYYY',
    'ne-NP': 'YYYY/MM/DD',
    'en-NZ': 'DD/MM/YYYY',
    'es-PE': 'DD/MM/YYYY',
    'en-PG': 'DD/MM/YYYY',
    'en-PH': 'MM/DD/YYYY',
    'en-PK': 'DD/MM/YYYY',
    'ar-QA': 'DD/MM/YYYY',
    'ru-RU': 'DD.MM.YYYY',
    'ar-SA': 'DD/MM/YYYY',
    'en-SC': 'DD/MM/YYYY',
    'sv-SE': 'YYYY-MM-DD',
    'en-SG': 'DD/MM/YYYY',
    'en-SL': 'DD/MM/YYYY',
    'so-SO': 'DD/MM/YYYY',
    'en-SS': 'DD/MM/YYYY',
    'es-SV': 'DD/MM/YYYY',
    'en-SZ': 'DD/MM/YYYY',
    'th-TH': 'DD/MM/YYYY',
    'en-TT': 'MM/DD/YYYY',
    'sw-TZ': 'DD/MM/YYYY',
    'en-US': 'MM/DD/YYYY',
    'es-UY': 'DD/MM/YYYY',
    'uz-UZ': 'DD/MM/YYYY',
    'ar-YE': 'DD/MM/YYYY',
    'en-ZA': 'YYYY/MM/DD',
    'ar-KW': 'DD/MM/YYYY',
    'ar-BH': 'DD/MM/YYYY',
    'ar-OM': 'DD/MM/YYYY', // Arabic (Oman)
};

/**
 * Parses a date string based on a specific format.
 *
 * @param dateString The date string to parse.
 * @param format The format to use for parsing.
 * @returns The parsed Date object or null if parsing fails.
 */
const parseDateWithFormat = (dateString, format) => {
    // Determine the separator based on the format (supports '/', '.', or '-')
    const separator = format.includes('/')
        ? '/'
        : format.includes('.')
            ? '.'
            : '-';
    const formatParts = format.split(separator);
    const dateParts = dateString.split(separator).map((num) => parseInt(num, 10));
    let year = 0, month = 0, day = 0;
    let yearSet = false, monthSet = false, daySet = false;
    // Check for format and date string mismatch
    if (dateParts.length !== formatParts.length) {
        return null; // Mismatch between date string and format
    }
    formatParts.forEach((part, index) => {
        // Check for non-numeric values in date string
        if (isNaN(dateParts[index])) {
            return null; // Invalid date part
        }
        // Assign year, month, and day based on the format
        switch (part) {
            case 'DD':
                day = dateParts[index];
                daySet = true;
                break;
            case 'MM':
                month = dateParts[index] - 1; // Adjust for zero-indexed months in JavaScript Date
                monthSet = true;
                break;
            case 'YYYY':
                year = dateParts[index];
                yearSet = true;
                break;
        }
    });
    // Validate and create the date only if all parts are set
    if (yearSet && monthSet && daySet) {
        const parsedDate = new Date(year, month, day);
        // Validate date to catch invalid dates like February 30th
        if (parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month &&
            parsedDate.getDate() === day) {
            return parsedDate;
        }
    }
    return null; // Invalid date or incomplete date information
};
var parseDateWithFormat$1 = withErrorBoundary(parseDateWithFormat);

/**
 * Attempts to parse a string into a date object based on locale.
 * Uses the localeDateFormats mapping for determining the date format.
 *
 * @param dateString - The date string to parse.
 * @param locale - The locale to use for parsing.
 * @returns The parsed Date object or null if parsing fails.
 */
const parseDate = (dateString, locale) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    const format = LOCALE_DATE_FORMATS[locale];
    if (!format) {
        throw new Error(`No date format found for locale: ${locale}`);
    }
    return parseDateWithFormat$1(dateString, format);
};
var parseDate$1 = withErrorBoundary(parseDate);

/**
 * Subtracts a specified amount of time from a date.
 *
 * @param date The original date.
 * @param value The amount to subtract.
 * @param unit The unit of time to subtract (e.g., 'days', 'months', 'years').
 * @returns A new Date object with the time subtracted.
 */
const subtract = (date, value, unit) => {
    return add$1(date, -value, unit); // Reuse the add function with negative value
};
var subtract$1 = withErrorBoundary(subtract);

exports.add = add$1;
exports.formatDate = formatDate$1;
exports.formatDateTime = formatDateTime$1;
exports.formatNumber = formatNumber$1;
exports.formatNumberByParts = formatNumberByParts$1;
exports.formatPhoneNumber = formatPhoneNumber$1;
exports.formatTime = formatTime$1;
exports.getCurrencyList = getCurrencyList$1;
exports.getCurrencySymbol = getCurrencySymbol$1;
exports.getFirstDayOfWeek = getFirstDayOfWeek$1;
exports.getQuarter = getQuarter$1;
exports.getRelativeTime = getRelativeTime$1;
exports.getState = getState$1;
exports.getWeek = getWeek$1;
exports.getWeekdays = getWeekdays$1;
exports.isAfter = isAfter$1;
exports.isBefore = isBefore$1;
exports.isLeapYear = isLeapYear$1;
exports.isSameDay = isSameDay$1;
exports.isValidDate = isValidDate$1;
exports.isValidPhoneNumber = isValidPhoneNumber$1;
exports.parseDate = parseDate$1;
exports.parsePhoneNumber = parsePhoneNumber$1;
exports.resetState = resetState$1;
exports.setState = setState$1;
exports.subtract = subtract$1;
