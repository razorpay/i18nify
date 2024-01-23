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
export const stringToDate = (dateString: string): Date => {
  // List of supported date and timestamp formats.
  const supportedDateFormats = [
    // Date formats
    {
      regex: /^(\d{4})\/(\d{2})\/(\d{2})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
    }, // YYYY/MM/DD
    {
      regex: /^(\d{2})\/(\d{2})\/(\d{4})$/,
      yearIndex: 3,
      monthIndex: 2,
      dayIndex: 1,
    }, // DD/MM/YYYY
    {
      regex: /^(\d{4})\.(\d{2})\.(\d{2})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
    }, // YYYY.MM.DD
    {
      regex: /^(\d{2})-(\d{2})-(\d{4})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
    }, // DD-MM-YYYY
    {
      regex: /^(\d{2})\/(\d{2})\/(\d{4})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
    }, // MM/DD/YYYY
    {
      regex: /^(\d{4})-(\d{2})-(\d{2})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
    }, // YYYY-MM-DD
    {
      regex: /^(\d{4})\.\s*(\d{2})\.\s*(\d{2})\.\s*$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
    }, // YYYY. MM. DD.
    {
      regex: /^(\d{2})\.(\d{2})\.(\d{4})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
    }, // DD.MM.YYYY

    // Timestamp formats
    {
      regex: /^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
      hourIndex: 4,
      minuteIndex: 5,
      secondIndex: 6,
    }, // YYYY/MM/DD HH:MM:SS
    {
      regex: /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
      yearIndex: 3,
      monthIndex: 2,
      dayIndex: 1,
      hourIndex: 4,
      minuteIndex: 5,
      secondIndex: 6,
    }, // DD/MM/YYYY HH:MM:SS
    {
      regex: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
      hourIndex: 4,
      minuteIndex: 5,
      secondIndex: 6,
    }, // YYYY-MM-DD HH:MM:SS
    {
      regex: /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
      yearIndex: 3,
      monthIndex: 2,
      dayIndex: 1,
      hourIndex: 4,
      minuteIndex: 5,
      secondIndex: 6,
    }, // DD-MM-YYYY HH:MM:SS
    {
      regex: /^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
      hourIndex: 4,
      minuteIndex: 5,
      secondIndex: 6,
    }, // YYYY.MM.DD HH:MM:SS
    {
      regex: /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
      yearIndex: 3,
      monthIndex: 2,
      dayIndex: 1,
      hourIndex: 4,
      minuteIndex: 5,
      secondIndex: 6,
    }, // DD.MM.YYYY HH:MM:SS

    // ISO 8601 Timestamp format
    {
      regex: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
      yearIndex: 1,
      monthIndex: 2,
      dayIndex: 3,
      hourIndex: 4,
      minuteIndex: 5,
      secondIndex: 6,
    }, // YYYY-MM-DDTHH:MM:SS
  ];

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
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    }
  }

  // If no format matches, throw an error.
  throw new Error('Date format not recognized');
};
