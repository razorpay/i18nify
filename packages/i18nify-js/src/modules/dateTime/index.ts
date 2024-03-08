/**
 * This module offers a range of functions tailored for date and time formatting and manipulation,
 * leveraging the capabilities of the JavaScript Intl API and Date object. It is designed to handle
 * dates and times in a way that respects locale-specific conventions and preferences.
 */

export { default as formatDateTime } from './formatDateTime';
export { default as getRelativeTime } from './getRelativeTime';
export { default as getWeekdays } from './getWeekdays';
export { default as parseDateTime } from './parseDateTime';

// For additional information, refer to the documentation: https://react-spectrum.adobe.com/internationalized/date/index.html
/**
 * Direct exports include Calendar, CalendarDate, CalendarDateTime, Time, and ZonedDateTime.
 * Notably absent from the direct exports is DateFormatter. This exclusion is intentional
 * to highlight our enhancements around DateFormatter, which now includes extended functionalities
 * such as provider state and automatic locale detection, aimed at simplifying its usage.
 */
export {
  Calendar,
  CalendarDate,
  CalendarDateTime,
  Time,
  ZonedDateTime,
} from '@internationalized/date';
