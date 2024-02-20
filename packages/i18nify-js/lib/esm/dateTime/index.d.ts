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

declare const _default$6: (date: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: DateFormatOptions | undefined;
} | undefined) => string;

declare const _default$5: (date: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: Intl.DateTimeFormatOptions | undefined;
} | undefined) => string;

declare const _default$4: (date: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: TimeFormatOptions | undefined;
} | undefined) => string;

declare const _default$3: (date: DateInput, baseDate?: DateInput | undefined, options?: {
    locale?: string | undefined;
    intlOptions?: Intl.RelativeTimeFormatOptions | undefined;
} | undefined) => string;

declare const _default$2: (options: {
    locale?: string | undefined;
    intlOptions: Intl.DateTimeFormatOptions;
}) => string[];

declare const _default$1: (dateString: string) => boolean;

declare const _default: (dateInput: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: Intl.DateTimeFormatOptions | undefined;
} | undefined) => ParsedDateTime;

export { _default$6 as formatDate, _default$5 as formatDateTime, _default$4 as formatTime, _default$3 as getRelativeTime, _default$2 as getWeekdays, _default$1 as isValidDate, _default as parseDateTime };
