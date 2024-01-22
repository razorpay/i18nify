export const stringToDate = (dateString: string): Date => {
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
