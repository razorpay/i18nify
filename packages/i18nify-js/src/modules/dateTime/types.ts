import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';

export type DateInput = Date | string;
export type Locale = string;

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {}

export interface DateFormatOptions
  extends Omit<Intl.DateTimeFormatOptions, 'timeStyle'> {}

export interface TimeFormatOptions
  extends Omit<Intl.DateTimeFormatOptions, 'dateStyle'> {}

export type FormattedPartsObject = {
  [key in (typeof ALLOWED_FORMAT_PARTS_KEYS)[number]]?: string | undefined;
};

export interface ParsedDateTime extends FormattedPartsObject {
  rawParts: Array<{ type: string; value: unknown }>;
  formattedDate: string;
  dateObj: Date | null;
}

export interface SupportedDateFormats {
  regex: RegExp;
  yearIndex: number;
  monthIndex: number;
  dayIndex: number;
  hourIndex?: number;
  minuteIndex?: number;
  secondIndex?: number;
  format: string;
}
