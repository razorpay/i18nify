declare const ALLOWED_FORMAT_PARTS_KEYS: readonly ["day", "dayPeriod", "era", "fractionalSecond", "hour", "minute", "month", "relatedYear", "second", "timeZone", "weekday", "year", "yearName"];

type DateInput = Date | string;
interface DateFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'timeStyle'> {
}
interface TimeFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'dateStyle'> {
}
type FormattedPartsObject = {
    [key in (typeof ALLOWED_FORMAT_PARTS_KEYS)[number]]?: string | undefined;
};
interface ParsedDateTime extends FormattedPartsObject {
    rawParts: Array<{
        type: string;
        value: unknown;
    }>;
    formattedDate: string;
    dateObj: Date | null;
}

declare const _default$f: (date: DateInput, value: number, unit: "days" | "months" | "years") => Date;

declare const _default$e: (date: DateInput, locale?: string | undefined, intlOptions?: DateFormatOptions | undefined) => string;

declare const _default$d: (date: DateInput, locale?: string | undefined, intlOptions?: Intl.DateTimeFormatOptions | undefined) => string;

declare const _default$c: (date: DateInput, locale?: string | undefined, intlOptions?: TimeFormatOptions | undefined) => string;

declare const _default$b: (locale: string, intlOptions?: Intl.DateTimeFormatOptions | undefined) => string;

declare const _default$a: (date: DateInput) => number;

declare const _default$9: (date: DateInput, baseDate?: DateInput | undefined, locale?: string | undefined, intlOptions?: Intl.RelativeTimeFormatOptions | undefined) => string;

declare const _default$8: (date: DateInput) => number;

declare const _default$7: (locale?: string | undefined, intlOptions?: Intl.DateTimeFormatOptions | undefined) => string[];

declare const _default$6: (date1: DateInput, date2: DateInput) => boolean;

declare const _default$5: (date1: DateInput, date2: DateInput) => boolean;

declare const _default$4: (year: number) => boolean;

declare const _default$3: (date1: Date, date2: Date) => boolean;

declare const _default$2: (date: any) => boolean;

declare const _default$1: (dateInput: DateInput, intlOptions?: Intl.DateTimeFormatOptions | undefined, locale?: string | undefined) => ParsedDateTime;

declare const _default: (date: DateInput, value: number, unit: "days" | "months" | "years") => Date;

export { _default$f as add, _default$e as formatDate, _default$d as formatDateTime, _default$c as formatTime, _default$b as getFirstDayOfWeek, _default$a as getQuarter, _default$9 as getRelativeTime, _default$8 as getWeek, _default$7 as getWeekdays, _default$6 as isAfter, _default$5 as isBefore, _default$4 as isLeapYear, _default$3 as isSameDay, _default$2 as isValidDate, _default$1 as parseDateTime, _default as subtract };
