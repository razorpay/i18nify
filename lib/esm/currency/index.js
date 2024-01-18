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

export { formatNumber$1 as formatNumber, formatNumberByParts$1 as formatNumberByParts, getCurrencyList$1 as getCurrencyList, getCurrencySymbol$1 as getCurrencySymbol };
//# sourceMappingURL=index.js.map
