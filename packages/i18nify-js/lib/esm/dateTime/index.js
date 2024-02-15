import { w as withErrorBoundary } from '../index-0rEDS6JS.js';
import { g as getLocale } from '../getLocale-lXmQK92B.js';
import '../index-fuw8iepm.js';

/**
 * Formats date based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param options - config object.
 * @returns {string} Formatted date string.
 */
const formatDate = (date, options = {}) => {
    const locale = getLocale(options);
    const fullOptions = Object.assign({ year: 'numeric', month: 'numeric', day: 'numeric' }, options.intlOptions);
    let formattedDate;
    try {
        formattedDate = new Intl.DateTimeFormat(locale, fullOptions).format(new Date(date));
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

const supportedDateFormats = [
    // Date formats
    {
        regex: /^(\d{4})\/(0[1-9]|1[0-2])\/(\d{2})$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        format: 'YYYY/MM/DD',
    },
    {
        regex: /^(\d{2})\/(0[1-9]|1[0-2])\/(\d{4})$/,
        yearIndex: 3,
        monthIndex: 2,
        dayIndex: 1,
        format: 'DD/MM/YYYY',
    },
    {
        regex: /^(\d{4})\.(0[1-9]|1[0-2])\.(\d{2})$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        format: 'YYYY.MM.DD',
    },
    {
        regex: /^(\d{2})-(0[1-9]|1[0-2])-(\d{4})$/,
        yearIndex: 3,
        monthIndex: 2,
        dayIndex: 1,
        format: 'DD-MM-YYYY',
    },
    {
        regex: /^(0[1-9]|1[0-2])\/(\d{2})\/(\d{4})$/,
        yearIndex: 3,
        monthIndex: 1,
        dayIndex: 2,
        format: 'MM/DD/YYYY',
    },
    {
        regex: /^(\d{4})-(0[1-9]|1[0-2])-(\d{2})$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        format: 'YYYY-MM-DD',
    },
    {
        regex: /^(\d{4})\.\s*(0[1-9]|1[0-2])\.\s*(\d{2})\.\s*$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        format: 'YYYY. MM. DD.',
    },
    {
        regex: /^(\d{2})\.(0[1-9]|1[0-2])\.(\d{4})$/,
        yearIndex: 3,
        monthIndex: 2,
        dayIndex: 1,
        format: 'DD.MM.YYYY',
    },
    {
        regex: /^(0[1-9]|1[0-2])\.(\d{2})\.(\d{4})$/,
        yearIndex: 3,
        monthIndex: 1,
        dayIndex: 2,
        format: 'MM.DD.YYYY',
    },
    // Timestamp formats
    {
        regex: /^(\d{4})\/(0[1-9]|1[0-2])\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        hourIndex: 4,
        minuteIndex: 5,
        secondIndex: 6,
        format: 'YYYY/MM/DD HH:MM:SS',
    },
    {
        regex: /^(\d{2})\/(0[1-9]|1[0-2])\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
        yearIndex: 3,
        monthIndex: 2,
        dayIndex: 1,
        hourIndex: 4,
        minuteIndex: 5,
        secondIndex: 6,
        format: 'DD/MM/YYYY HH:MM:SS',
    },
    {
        regex: /^(\d{4})-(0[1-9]|1[0-2])-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        hourIndex: 4,
        minuteIndex: 5,
        secondIndex: 6,
        format: 'YYYY-MM-DD HH:MM:SS',
    },
    {
        regex: /^(\d{2})-(0[1-9]|1[0-2])-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
        yearIndex: 3,
        monthIndex: 2,
        dayIndex: 1,
        hourIndex: 4,
        minuteIndex: 5,
        secondIndex: 6,
        format: 'DD-MM-YYYY HH:MM:SS',
    },
    {
        regex: /^(\d{4})\.(0[1-9]|1[0-2])\.(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        hourIndex: 4,
        minuteIndex: 5,
        secondIndex: 6,
        format: 'YYYY.MM.DD HH:MM:SS',
    },
    {
        regex: /^(\d{2})\.(0[1-9]|1[0-2])\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
        yearIndex: 3,
        monthIndex: 2,
        dayIndex: 1,
        hourIndex: 4,
        minuteIndex: 5,
        secondIndex: 6,
        format: 'DD.MM.YYYY HH:MM:SS',
    },
    // ISO 8601 Timestamp format
    {
        regex: /^(\d{4})-(0[1-9]|1[0-2])-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
        yearIndex: 1,
        monthIndex: 2,
        dayIndex: 3,
        hourIndex: 4,
        minuteIndex: 5,
        secondIndex: 6,
        format: 'YYYY-MM-DDTHH:MM:SS',
    },
];

/**
 * Converts a string representation of a date into a Date object.
 * The function supports various date and timestamp formats,
 * including both American and European styles, with or without time components.
 * If the provided string doesn't match any of the supported formats,
 * the function throws an error.
 *
 * @param {string} dateString - The date string to be converted to a Date object.
 * @returns {Date} A Date object representing the date and time specified in the dateString.
 * @throws {Error} If the date format is not recognized.
 */
const stringToDate = (dateString) => {
    // Iterate through each supported date format.
    for (const format of supportedDateFormats) {
        const match = dateString.match(format.regex);
        if (match) {
            // Extract year, month, and day from the matched groups.
            const year = match[format.yearIndex];
            const month = match[format.monthIndex];
            const day = match[format.dayIndex];
            // Extract time components if available, defaulting to '00' if not present.
            const hour = format.hourIndex ? match[format.hourIndex] : '00';
            const minute = format.minuteIndex ? match[format.minuteIndex] : '00';
            const second = format.secondIndex ? match[format.secondIndex] : '00';
            // Construct and return the Date object.
            try {
                const dateObj = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
                if (dateObj.getTime())
                    return dateObj;
                else
                    throw new Error('Invalid Date!');
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new Error(err.message);
                }
                else {
                    throw new Error(`An unknown error occurred = ${err}`);
                }
            }
        }
    }
    // If no format matches, throw an error.
    throw new Error('Date format not recognized');
};

/**
 * Formats date and time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param options - Config object.
 * @returns {string} Formatted date and time string.
 */
const formatDateTime = (date, options = {}) => {
    const locale = getLocale(options);
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    // Ensure default options include date and time components
    const defaultOptions = Object.assign({ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }, options.intlOptions);
    let formatter;
    try {
        formatter = new Intl.DateTimeFormat(locale, defaultOptions);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error(`An unknown error occurred = ${err}`);
        }
    }
    return formatter.format(date);
};
var formatDateTime$1 = withErrorBoundary(formatDateTime);

/**
 * Formats time based on the locale.
 * @param {DateInput} date - Date object or date string.
 * @param options - Config object
 * @returns {string} Formatted time string.
 *
 * Example 1: en-US locale, date: 2024-01-01T12:00:00 ---> Output: 12:00:00 PM
 * Example 2: en-IN locale, date: Wed Feb 14 2024 17:18:42 GMT+0530 (India Standard Time) ---> Output: 5:18:42 pm
 * Example 3: fr-FR locale, date: Wed Feb 14 2024 17:18:42 GMT+0530 (India Standard Time) ---> Output: 17:18:42
 */
const formatTime = (date, options = {}) => {
    const locale = getLocale(options);
    const fullOptions = Object.assign({ hour: 'numeric', minute: 'numeric', second: 'numeric' }, options.intlOptions);
    let formattedTime;
    try {
        formattedTime = new Intl.DateTimeFormat(locale, fullOptions).format(new Date(date));
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
 * Provides a relative time string (e.g., '3 hours ago', 'in 2 days').
 * This function calculates the difference between the given date and the base date,
 * then formats it in a locale-sensitive manner. It allows customization of the output
 * through Intl.RelativeTimeFormat options.
 *
 * @param date - The date to compare.
 * @param baseDate - The date to compare against (default: current date).
 * @param options - Config object.
 * @returns The relative time as a string.
 */
const getRelativeTime = (date, baseDate = new Date(), options = {}) => {
    date =
        typeof date === 'string' ? new Date(stringToDate(date)) : new Date(date);
    baseDate =
        typeof baseDate === 'string'
            ? new Date(stringToDate(baseDate))
            : new Date(baseDate);
    const locale = getLocale(options);
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
        const rtf = new Intl.RelativeTimeFormat(locale, options.intlOptions);
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
 * Returns an array of weekdays according to the specified locale.
 *
 * @param options Config object
 * @returns An array of weekday names.
 */
const getWeekdays = (options) => {
    try {
        const locale = getLocale(options);
        if (!options.intlOptions.weekday)
            options.intlOptions.weekday = 'long';
        const formatter = new Intl.DateTimeFormat(locale, options.intlOptions);
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
 * Checks if a given string is a valid date according to a specific locale's date format.
 *
 * @param dateString The date string to validate.
 * @returns True if the dateString is a valid date according to the locale's format, false otherwise.
 */
const isValidDate = (dateString) => {
    // Try to parse the date string using the Date object
    const date = new Date(dateString);
    // Check if the date is an invalid Date object (e.g., new Date('invalid') -> NaN)
    if (isNaN(date.getTime())) {
        return false; // The date is invalid
    }
    else {
        // Use Intl.DateTimeFormat to format the date back to a string
        const formattedDateStr = new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'numeric',
            day: '2-digit'
        }).format(date);
        // Create a date string for comparison in YYYY-MM-DD format
        // This step is necessary because the input format should match the expected format
        const [day, month, year] = formattedDateStr.split('/');
        const formattedInputDate = `${year}-${month}-${day}`;
        const inputedDate = `${new Date(dateString).getFullYear()}-${new Date(dateString).getMonth() + 1}-${new Date(dateString).getDate()}`;
        // Compare the formatted date with the original date string
        return inputedDate === formattedInputDate;
    }
};
var isValidDate$1 = withErrorBoundary(isValidDate);

const ALLOWED_FORMAT_PARTS_KEYS = [
    'day',
    'dayPeriod',
    'era',
    'fractionalSecond',
    'hour',
    'minute',
    'month',
    'relatedYear',
    'second',
    'timeZone',
    'weekday',
    'year',
    'yearName',
];

/**
 * Parses a date input and returns a detailed object containing various date components
 * and their formatted representations.
 *
 * @param {DateInput} dateInput - The date input, can be a string or a Date object.
 * @param options - Config object.
 * @returns {ParsedDateTime} An object containing the parsed date and its components.
 */
const parseDateTime = (dateInput, options = {}) => {
    // Parse the input date, converting strings to Date objects if necessary
    const date = typeof dateInput === 'string'
        ? new Date(stringToDate(dateInput))
        : new Date(dateInput);
    const locale = getLocale(options);
    try {
        // Create an Intl.DateTimeFormat instance for formatting
        const dateTimeFormat = new Intl.DateTimeFormat(locale, options.intlOptions);
        const formattedParts = dateTimeFormat.formatToParts(date);
        const formattedObj = {};
        // Iterate over each part of the formatted date
        formattedParts.forEach((part) => {
            // If the part is allowed, add it to the formatted object
            // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal', 'unknown' is skipped
            if (ALLOWED_FORMAT_PARTS_KEYS.includes(part.type)) {
                // @ts-expect-error only allowed keys are added to the formattedObj. For eg, key 'literal', 'unknown' is skipped
                formattedObj[part.type] = (formattedObj[part.type] || '') + part.value;
            }
        });
        // Return the detailed parsed date object
        return Object.assign(Object.assign({}, formattedObj), { rawParts: formattedParts, formattedDate: formattedParts.map((p) => p.value).join(''), dateObj: date });
    }
    catch (err) {
        // Handle any errors that occur during parsing
        if (err instanceof Error) {
            throw err;
        }
        else {
            throw new Error(`An unknown error occurred: ${err}`);
        }
    }
};
var parseDateTime$1 = withErrorBoundary(parseDateTime);

export { formatDate$1 as formatDate, formatDateTime$1 as formatDateTime, formatTime$1 as formatTime, getRelativeTime$1 as getRelativeTime, getWeekdays$1 as getWeekdays, isValidDate$1 as isValidDate, parseDateTime$1 as parseDateTime };
//# sourceMappingURL=index.js.map
