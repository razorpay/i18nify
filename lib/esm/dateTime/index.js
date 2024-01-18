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

const stringToDate = (dateString) => {
    const supportedDateFormats = [
        // Date formats
        {
            regex: /^(\d{4})\/(\d{2})\/(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
        },
        {
            regex: /^(\d{2})\/(\d{2})\/(\d{4})$/,
            yearIndex: 3,
            monthIndex: 2,
            dayIndex: 1,
        },
        {
            regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
        },
        {
            regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
        },
        {
            regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
        },
        {
            regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
        },
        {
            regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
        },
        {
            regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
        },
        // Timestamp formats
        {
            regex: /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
            hourIndex: 4,
            minuteIndex: 5,
            secondIndex: 6,
        },
        {
            regex: /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
            yearIndex: 3,
            monthIndex: 2,
            dayIndex: 1,
            hourIndex: 4,
            minuteIndex: 5,
            secondIndex: 6,
        },
        {
            regex: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
            hourIndex: 4,
            minuteIndex: 5,
            secondIndex: 6,
        },
        {
            regex: /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
            yearIndex: 3,
            monthIndex: 2,
            dayIndex: 1,
            hourIndex: 4,
            minuteIndex: 5,
            secondIndex: 6,
        },
        {
            regex: /^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
            yearIndex: 1,
            monthIndex: 2,
            dayIndex: 3,
            hourIndex: 4,
            minuteIndex: 5,
            secondIndex: 6,
        },
        {
            regex: /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
            yearIndex: 3,
            monthIndex: 2,
            dayIndex: 1,
            hourIndex: 4,
            minuteIndex: 5,
            secondIndex: 6,
        }, // DD.MM.YYYY HH:MM:SS
    ];
    for (const format of supportedDateFormats) {
        const match = dateString.match(format.regex);
        if (match) {
            const year = match[format.yearIndex];
            const month = match[format.monthIndex];
            const day = match[format.dayIndex];
            const hour = format.hourIndex ? match[format.hourIndex] : '00';
            const minute = format.minuteIndex ? match[format.minuteIndex] : '00';
            const second = format.secondIndex ? match[format.secondIndex] : '00';
            return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        }
    }
    throw new Error('Date format not recognized');
};

/**
 * Adds a specified amount of time to a date.
 *
 * @param date The original date.
 * @param value The amount to add.
 * @param unit The unit of time to add (e.g., 'days', 'months', 'years').
 * @returns A new Date object with the time added.
 */
const add = (date, value, unit) => {
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    switch (unit) {
        case 'days':
            date.setDate(date.getDate() + value);
            break;
        case 'months':
            date.setMonth(date.getMonth() + value);
            break;
        case 'years':
            date.setFullYear(date.getFullYear() + value);
            break;
    }
    return date;
};
var add$1 = withErrorBoundary(add);

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

/**
 * Formats date and time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param {Locale} locale - Locale string.
 * @param {DateTimeFormatOptions} options - Intl.DateTimeFormat options (optional).
 * @returns {string} Formatted date and time string.
 */
const formatDateTime = (date, locale, intlOptions = {}) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    const dateObj = date instanceof Date ? date : new Date(date);
    let formatter;
    try {
        formatter = new Intl.DateTimeFormat(locale, intlOptions);
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
 * @param intlOptions Optional Intl.DateTimeFormatOptions for customization.
 * @returns The first day of the week (0-6, where 0 is Sunday).
 */
const getFirstDayOfWeek = (locale, intlOptions = {}) => {
    /** retrieve locale from below areas in order of preference
     * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
     * 2. i18nState.locale (uses locale set globally)
     * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
     * */
    if (!locale)
        locale = state.getState().locale || getLocale();
    let formatted;
    if (!intlOptions.weekday)
        intlOptions.weekday = 'long';
    try {
        const formatter = new Intl.DateTimeFormat(locale, intlOptions);
        /**
         * This date was chosen because January 2, 2000, is a Sunday.
         * In the Gregorian calendar, Sunday is considered the start of the week in some cultures (like in the United States), while in others, it's Monday (like in much of Europe).
         * By using a date that is known to be a Sunday, the function can accurately determine what day of the week is considered the start in the specified locale.
         */
        const sundayDate = new Date(2000, 0, 2); // A known Sunday
        formatted = formatter.format(sundayDate);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    // Generate localized weekdays array starting from Sunday
    const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, intlOptions).format(new Date(2000, 0, 2 + i)));
    const firstDayIndex = weekdays.indexOf(formatted);
    if (firstDayIndex === -1) {
        throw new Error('Unable to determine the first day of the week');
    }
    return weekdays[(firstDayIndex + 1) % 7]; // Adjusting since our reference date is a Sunday
};
var getFirstDayOfWeek$1 = withErrorBoundary(getFirstDayOfWeek);

/**
 * Determines the quarter of the year for a given date.
 *
 * @param date The date to determine the quarter for.
 * @returns The quarter of the year (1-4).
 */
const getQuarter = (date) => {
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
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
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    baseDate =
        typeof baseDate === 'string'
            ? new Date(stringToDate(baseDate))
            : new Date(baseDate);
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
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
var getWeek$1 = withErrorBoundary(getWeek);

/**
 * Returns an array of weekdays according to the specified locale.
 *
 * @param locale The locale to get weekdays for.
 * @param intlOptions Optional Intl.DateTimeFormatOptions for customization.
 * @returns An array of weekday names.
 */
const getWeekdays = (locale, intlOptions = {}) => {
    try {
        /** retrieve locale from below areas in order of preference
         * 1. locale (used in case if someone wants to override locale just for a specific area and not globally)
         * 2. i18nState.locale (uses locale set globally)
         * 3. navigator (in case locale is not passed or set, use it from browser's navigator)
         * */
        if (!locale)
            locale = state.getState().locale || getLocale();
        if (!intlOptions.weekday)
            intlOptions.weekday = 'long';
        const formatter = new Intl.DateTimeFormat(locale, intlOptions);
        /** The date January 1, 1970, is a well-known reference point in computing known as the Unix epoch.
         * It's the date at which time is measured for Unix systems, making it a consistent and reliable choice for date calculations.
         * The choice of the date January 4, 1970, as the starting point is significant.
         * January 4, 1970, was a Sunday.
         * Since weeks typically start on Sunday or Monday in most locales, starting from a known Sunday allows the function to cycle through a complete week, capturing all weekdays in the order they appear for the given locale.
         * */
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
    date1 =
        typeof date1 === 'string' ? new Date(stringToDate(date1)) : new Date(date1);
    date2 =
        typeof date2 === 'string' ? new Date(stringToDate(date2)) : new Date(date2);
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
    date1 =
        typeof date1 === 'string' ? new Date(stringToDate(date1)) : new Date(date1);
    date2 =
        typeof date2 === 'string' ? new Date(stringToDate(date2)) : new Date(date2);
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
    date1 =
        typeof date1 === 'string' ? new Date(stringToDate(date1)) : new Date(date1);
    date2 =
        typeof date2 === 'string' ? new Date(stringToDate(date2)) : new Date(date2);
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
    try {
        date =
            typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
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
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    return add$1(date, -value, unit); // Reuse the add function with negative value
};
var subtract$1 = withErrorBoundary(subtract);

export { add$1 as add, formatDate$1 as formatDate, formatDateTime$1 as formatDateTime, formatTime$1 as formatTime, getFirstDayOfWeek$1 as getFirstDayOfWeek, getQuarter$1 as getQuarter, getRelativeTime$1 as getRelativeTime, getWeek$1 as getWeek, getWeekdays$1 as getWeekdays, isAfter$1 as isAfter, isBefore$1 as isBefore, isLeapYear$1 as isLeapYear, isSameDay$1 as isSameDay, isValidDate$1 as isValidDate, parseDate$1 as parseDate, subtract$1 as subtract };
//# sourceMappingURL=index.js.map
