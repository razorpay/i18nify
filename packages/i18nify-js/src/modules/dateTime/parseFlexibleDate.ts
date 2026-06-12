import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput } from './types';
import { convertToStandardDate } from './utils';

export interface ParsedFlexibleDate {
  date: Date;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timestamp: number;
}

const parseFlexibleDate = (input: DateInput): ParsedFlexibleDate => {
  if (input === null || input === undefined || input === '') {
    throw new Error(
      `parseFlexibleDate: invalid input — received: ${String(input)}.`,
    );
  }

  const date = convertToStandardDate(input);

  if (isNaN(date.getTime())) {
    throw new Error(
      `parseFlexibleDate: could not parse "${String(input)}" as a valid date.`,
    );
  }

  return {
    date,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    timestamp: date.getTime(),
  };
};

export default withErrorBoundary<typeof parseFlexibleDate>(parseFlexibleDate);
