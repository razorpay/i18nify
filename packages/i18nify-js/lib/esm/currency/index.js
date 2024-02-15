import { w as withErrorBoundary } from '../index-0rEDS6JS.js';
import { g as getLocale } from '../getLocale-lXmQK92B.js';
import '../index-fuw8iepm.js';

const getIntlInstanceWithOptions = (options = {}) => {
    const locale = getLocale(options);
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
    AED: {
        symbol: 'د.إ',
        name: 'United Arab Emirates Dirham',
        lowerUnitName: 'Fils',
    },
    ALL: {
        symbol: 'Lek',
        name: 'Albanian Lek',
        lowerUnitName: 'Qindarka',
    },
    AMD: {
        symbol: '֏',
        name: 'Armenian Dram',
        lowerUnitName: 'Luma',
    },
    ARS: {
        symbol: 'ARS',
        name: 'Argentine Peso',
        lowerUnitName: 'Centavo',
    },
    AUD: {
        symbol: 'A$',
        name: 'Australian Dollar',
        lowerUnitName: 'Cent',
    },
    AWG: {
        symbol: 'Afl.',
        name: 'Aruban Florin',
        lowerUnitName: 'Cent',
    },
    BBD: {
        symbol: '$',
        name: 'Barbadian Dollar',
        lowerUnitName: 'Cent',
    },
    BDT: {
        symbol: '৳',
        name: 'Bangladeshi Taka',
        lowerUnitName: 'Poisha',
    },
    BMD: {
        symbol: '$',
        name: 'Bermudian Dollar',
        lowerUnitName: 'Cent',
    },
    BND: {
        symbol: 'BND',
        name: 'Brunei Dollar',
        lowerUnitName: 'Sen',
    },
    BOB: {
        symbol: 'Bs',
        name: 'Bolivian Boliviano',
        lowerUnitName: 'Centavo',
    },
    BSD: {
        symbol: 'B$',
        name: 'Bahamian Dollar',
        lowerUnitName: 'Cent',
    },
    BWP: {
        symbol: 'P',
        name: 'Botswanan Pula',
        lowerUnitName: 'Thebe',
    },
    BZD: {
        symbol: 'BZ$',
        name: 'Belize Dollar',
        lowerUnitName: 'Cent',
    },
    CAD: {
        symbol: 'C$',
        name: 'Canadian Dollar',
        lowerUnitName: 'Cent',
    },
    CHF: {
        symbol: 'CHf',
        name: 'Swiss Franc',
        lowerUnitName: 'Rappen',
    },
    CNY: {
        symbol: '¥',
        name: 'Chinese Yuan',
        lowerUnitName: 'Fen',
    },
    COP: {
        symbol: 'COL$',
        name: 'Colombian Peso',
        lowerUnitName: 'Centavo',
    },
    CRC: {
        symbol: '₡',
        name: 'Costa Rican Colón',
        lowerUnitName: 'Céntimo',
    },
    CUP: {
        symbol: '$MN',
        name: 'Cuban Peso',
        lowerUnitName: 'Centavo',
    },
    CZK: {
        symbol: 'Kč',
        name: 'Czech Koruna',
        lowerUnitName: 'Haléř',
    },
    DKK: {
        symbol: 'DKK',
        name: 'Danish Krone',
        lowerUnitName: 'Øre',
    },
    DOP: {
        symbol: 'RD$',
        name: 'Dominican Peso',
        lowerUnitName: 'Centavo',
    },
    DZD: {
        symbol: 'د.ج',
        name: 'Algerian Dinar',
        lowerUnitName: 'Santeem',
    },
    EGP: {
        symbol: 'E£',
        name: 'Egyptian Pound',
        lowerUnitName: 'Piastre',
    },
    ETB: {
        symbol: 'ብር',
        name: 'Ethiopian Birr',
        lowerUnitName: 'Santim',
    },
    EUR: {
        symbol: '€',
        name: 'Euro',
        lowerUnitName: 'Cent',
    },
    FJD: {
        symbol: 'FJ$',
        name: 'Fijian Dollar',
        lowerUnitName: 'Cent',
    },
    GBP: {
        symbol: '£',
        name: 'British Pound',
        lowerUnitName: 'Penny',
    },
    GHS: {
        symbol: 'GH₵',
        name: 'Ghanaian Cedi',
        lowerUnitName: 'Pesewa',
    },
    GIP: {
        symbol: 'GIP',
        name: 'Gibraltar Pound',
        lowerUnitName: 'Penny',
    },
    GMD: {
        symbol: 'D',
        name: 'Gambian Dalasi',
        lowerUnitName: 'Butut',
    },
    GTQ: {
        symbol: 'Q',
        name: 'Guatemalan Quetzal',
        lowerUnitName: 'Centavo',
    },
    GYD: {
        symbol: 'G$',
        name: 'Guyanese Dollar',
        lowerUnitName: 'Cent',
    },
    HKD: {
        symbol: 'HK$',
        name: 'Hong Kong Dollar',
        lowerUnitName: 'Cent',
    },
    HNL: {
        symbol: 'HNL',
        name: 'Honduran Lempira',
        lowerUnitName: 'Centavo',
    },
    HRK: {
        symbol: 'kn',
        name: 'Croatian Kuna',
        lowerUnitName: 'Lipa',
    },
    HTG: {
        symbol: 'G',
        name: 'Haitian Gourde',
        lowerUnitName: 'Centime',
    },
    HUF: {
        symbol: 'Ft',
        name: 'Hungarian Forint',
        lowerUnitName: 'Fillér',
    },
    IDR: {
        symbol: 'Rp',
        name: 'Indonesian Rupiah',
        lowerUnitName: 'Sen',
    },
    ILS: {
        symbol: '₪',
        name: 'Israeli New Shekel',
        lowerUnitName: 'Agora',
    },
    INR: {
        symbol: '₹',
        name: 'Indian Rupee',
        lowerUnitName: 'Paisa',
    },
    JMD: {
        symbol: 'J$',
        name: 'Jamaican Dollar',
        lowerUnitName: 'Cent',
    },
    KES: {
        symbol: 'Ksh',
        name: 'Kenyan Shilling',
        lowerUnitName: 'Cent',
    },
    KGS: {
        symbol: 'Лв',
        name: 'Kyrgystani Som',
        lowerUnitName: 'Tyiyn',
    },
    KHR: {
        symbol: '៛',
        name: 'Cambodian Riel',
        lowerUnitName: 'Sen',
    },
    KYD: {
        symbol: 'CI$',
        name: 'Cayman Islands Dollar',
        lowerUnitName: 'Cent',
    },
    KZT: {
        symbol: '₸',
        name: 'Kazakhstani Tenge',
        lowerUnitName: 'Tiyn',
    },
    LAK: {
        symbol: '₭',
        name: 'Laotian Kip',
        lowerUnitName: 'Att',
    },
    LKR: {
        symbol: 'රු',
        name: 'Sri Lankan Rupee',
        lowerUnitName: 'Cent',
    },
    LRD: {
        symbol: 'L$',
        name: 'Liberian Dollar',
        lowerUnitName: 'Cent',
    },
    LSL: {
        symbol: 'LSL',
        name: 'Lesotho Loti',
        lowerUnitName: 'Sente',
    },
    MAD: {
        symbol: 'د.م.',
        name: 'Moroccan Dirham',
        lowerUnitName: 'Centime',
    },
    MDL: {
        symbol: 'MDL',
        name: 'Moldovan Leu',
        lowerUnitName: 'Ban',
    },
    MKD: {
        symbol: 'ден',
        name: 'Macedonian Denar',
        lowerUnitName: 'Deni',
    },
    MMK: {
        symbol: 'MMK',
        name: 'Myanmar Kyat',
        lowerUnitName: 'Pya',
    },
    MNT: {
        symbol: '₮',
        name: 'Mongolian Tugrik',
        lowerUnitName: 'Möngö',
    },
    MOP: {
        symbol: 'MOP$',
        name: 'Macanese Pataca',
        lowerUnitName: 'Avo',
    },
    MUR: {
        symbol: '₨',
        name: 'Mauritian Rupee',
        lowerUnitName: 'Cent',
    },
    MVR: {
        symbol: 'Rf',
        name: 'Maldivian Rufiyaa',
        lowerUnitName: 'Laari',
    },
    MWK: {
        symbol: 'MK',
        name: 'Malawian Kwacha',
        lowerUnitName: 'Tambala',
    },
    MXN: {
        symbol: 'Mex$',
        name: 'Mexican Peso',
        lowerUnitName: 'Centavo',
    },
    MYR: {
        symbol: 'RM',
        name: 'Malaysian Ringgit',
        lowerUnitName: 'Sen',
    },
    NAD: {
        symbol: 'N$',
        name: 'Namibian Dollar',
        lowerUnitName: 'Cent',
    },
    NGN: {
        symbol: '₦',
        name: 'Nigerian Naira',
        lowerUnitName: 'Kobo',
    },
    NIO: {
        symbol: 'NIO',
        name: 'Nicaraguan Córdoba',
        lowerUnitName: 'Centavo',
    },
    NOK: {
        symbol: 'NOK',
        name: 'Norwegian Krone',
        lowerUnitName: 'Øre',
    },
    NPR: {
        symbol: 'रू',
        name: 'Nepalese Rupee',
        lowerUnitName: 'Paisa',
    },
    NZD: {
        symbol: 'NZ$',
        name: 'New Zealand Dollar',
        lowerUnitName: 'Cent',
    },
    PEN: {
        symbol: 'S/',
        name: 'Peruvian Nuevo Sol',
        lowerUnitName: 'Céntimo',
    },
    PGK: {
        symbol: 'PGK',
        name: 'Papua New Guinean Kina',
        lowerUnitName: 'Toea',
    },
    PHP: {
        symbol: '₱',
        name: 'Philippine Peso',
        lowerUnitName: 'Centavo',
    },
    PKR: {
        symbol: '₨',
        name: 'Pakistani Rupee',
        lowerUnitName: 'Paisa',
    },
    QAR: {
        symbol: 'QR',
        name: 'Qatari Riyal',
        lowerUnitName: 'Dirham',
    },
    RUB: {
        symbol: '₽',
        name: 'Russian Ruble',
        lowerUnitName: 'Kopeck',
    },
    SAR: {
        symbol: 'SR',
        name: 'Saudi Riyal',
        lowerUnitName: 'Halala',
    },
    SCR: {
        symbol: 'SRe',
        name: 'Seychellois Rupee',
        lowerUnitName: 'Cent',
    },
    SEK: {
        symbol: 'SEK',
        name: 'Swedish Krona',
        lowerUnitName: 'Öre',
    },
    SGD: {
        symbol: 'S$',
        name: 'Singapore Dollar',
        lowerUnitName: 'Cent',
    },
    SLL: {
        symbol: 'Le',
        name: 'Sierra Leonean Leone',
        lowerUnitName: 'Cent',
    },
    SOS: {
        symbol: 'Sh.so.',
        name: 'Somali Shilling',
        lowerUnitName: 'Senti',
    },
    SSP: {
        symbol: 'SS£',
        name: 'South Sudanese Pound',
        lowerUnitName: 'Piaster',
    },
    SVC: {
        symbol: '₡',
        name: 'Salvadoran Colón',
        lowerUnitName: 'Centavo',
    },
    SZL: {
        symbol: 'E',
        name: 'Swazi Lilangeni',
        lowerUnitName: 'Cent',
    },
    THB: {
        symbol: '฿',
        name: 'Thai Baht',
        lowerUnitName: 'Satang',
    },
    TTD: {
        symbol: 'TT$',
        name: 'Trinidad and Tobago Dollar',
        lowerUnitName: 'Cent',
    },
    TZS: {
        symbol: 'Sh',
        name: 'Tanzanian Shilling',
        lowerUnitName: 'Cent',
    },
    USD: {
        symbol: '$',
        name: 'United States Dollar',
        lowerUnitName: 'Cent',
    },
    UYU: {
        symbol: '$U',
        name: 'Uruguayan Peso',
        lowerUnitName: 'Centésimo',
    },
    UZS: {
        symbol: "so'm",
        name: 'Uzbekistani Som',
        lowerUnitName: 'Tiyin',
    },
    YER: {
        symbol: '﷼',
        name: 'Yemeni Rial',
        lowerUnitName: 'Fils',
    },
    ZAR: {
        symbol: 'R',
        name: 'South African Rand',
        lowerUnitName: 'Cent',
    },
    KWD: {
        symbol: 'د.ك',
        name: 'Kuwaiti Dinar',
        lowerUnitName: 'Fils',
        minorUnitMultiplier: 1000,
    },
    BHD: {
        symbol: 'د.ب.',
        name: 'Bahraini Dinar',
        lowerUnitName: 'Fils',
        minorUnitMultiplier: 1000,
    },
    OMR: {
        symbol: 'ر.ع.',
        name: 'Omani Rial',
        lowerUnitName: 'Baisa',
        minorUnitMultiplier: 1000,
    },
    JPY: {
        symbol: '¥',
        name: 'Japanese Yen',
        lowerUnitName: '',
        minorUnitMultiplier: 1,
    },
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

/**
 * Converts an amount from a minor currency unit to a major currency unit.
 *
 * The function takes an amount in the minor unit (e.g., cents, pence) and a currency code,
 * then converts the amount to the major unit (e.g., dollars, pounds) using the conversion rate
 * defined in the CURRENCIES object. If the currency code is not supported, it throws an error.
 *
 * @param {number} amount - The amount in the minor currency unit.
 * @param {object} options - The options object
 * @returns {number} - The amount converted to the major currency unit.
 * @throws Will throw an error if the currency code is not supported.
 */
const convertToMajorUnit = (amount, options) => {
    const currencyInfo = CURRENCIES[options.currency];
    if (!currencyInfo)
        throw new Error(`Unsupported currency ${options.currency}`);
    const minorUnitMultiplier = currencyInfo.minorUnitMultiplier || 100;
    const higherCurrencyValue = amount / minorUnitMultiplier;
    return higherCurrencyValue;
};
var convertToMajorUnit$1 = withErrorBoundary(convertToMajorUnit);

/**
 * Converts an amount from a major currency unit to a minor currency unit.
 *
 * The function takes an amount in the major unit (e.g., dollars, pounds) and a currency code,
 * then converts the amount to the minor unit (e.g., cents, pence) using the conversion rate
 * defined in the CURRENCIES object. If the currency code is not supported, it throws an error.
 *
 * @param {number} amount - The amount in the major currency unit.
 * @param {object} options - The options object
 * @returns {number} - The amount converted to the minor currency unit.
 * @throws Will throw an error if the currency code is not supported.
 */
const convertToMinorUnit = (amount, options) => {
    const currencyInfo = CURRENCIES[options.currency];
    if (!currencyInfo)
        throw new Error(`Unsupported currency ${options.currency}`);
    const minorUnitMultiplier = currencyInfo.minorUnitMultiplier || 100;
    const lowerCurrencyValue = amount * minorUnitMultiplier;
    return lowerCurrencyValue;
};
var convertToMinorUnit$1 = withErrorBoundary(convertToMinorUnit);

export { convertToMajorUnit$1 as convertToMajorUnit, convertToMinorUnit$1 as convertToMinorUnit, formatNumber$1 as formatNumber, formatNumberByParts$1 as formatNumberByParts, getCurrencyList$1 as getCurrencyList, getCurrencySymbol$1 as getCurrencySymbol };
//# sourceMappingURL=index.js.map
