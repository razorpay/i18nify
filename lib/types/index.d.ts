interface I18nState {
    locale: string;
    direction: 'ltr' | 'rtl' | string;
    country: string;
}

declare const _default$p: () => I18nState;

declare const _default$o: (newState: Partial<I18nState>) => void;

declare const _default$n: () => void;

declare const _default$m: (amount: string | number, options?: {
    currency?: string | number | undefined;
    locale?: string | undefined;
    intlOptions?: Intl.NumberFormatOptions | undefined;
} | undefined) => string;

declare const _default$l: () => {
    [key: string]: {
        symbol: string;
        name: string;
    };
};

declare const _default$k: (currencyCode: string | number) => string;

declare const ALLOWED_FORMAT_PARTS_KEYS: readonly ["nan", "infinity", "percent", "integer", "group", "decimal", "fraction", "plusSign", "minusSign", "percentSign", "currency", "code", "symbol", "name", "compact", "exponentInteger", "exponentMinusSign", "exponentSeparator", "unit"];

type FormattedPartsObject = {
    [key in (typeof ALLOWED_FORMAT_PARTS_KEYS)[number]]?: string | undefined;
};
interface ByParts extends FormattedPartsObject {
    isPrefixSymbol: boolean;
    rawParts: Array<{
        type: string;
        value: unknown;
    }>;
}

declare const _default$j: (amount: string | number, options?: {
    currency?: string | number | undefined;
    locale?: string | undefined;
    intlOptions?: Intl.NumberFormatOptions | undefined;
} | undefined) => ByParts;

declare const _default$i: (phoneNumber: string | number, countryCode?: string | number | undefined) => boolean;

declare const _default$h: (phoneNumber: string | number, countryCode?: string | number | undefined) => string;

interface PhoneInfo {
    countryCode: string;
    dialCode: string;
    formattedPhoneNumber: string;
    formatTemplate: string;
}
declare const _default$g: (phoneNumber: string, country?: string | undefined) => PhoneInfo;

type DateInput = Date | string;
interface DateFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'timeStyle'> {
}
interface TimeFormatOptions extends Omit<Intl.DateTimeFormatOptions, 'dateStyle'> {
}

declare const _default$f: (date: DateInput, value: number, unit: "days" | "months" | "years") => Date;

declare const _default$e: (date: DateInput, locale: string, options?: DateFormatOptions | undefined) => string;

declare const _default$d: (date: DateInput, locale: string, intlOptions?: Intl.DateTimeFormatOptions | undefined) => string;

declare const _default$c: (date: DateInput, locale: string, options?: TimeFormatOptions | undefined) => string;

declare const _default$b: (locale: string, intlOptions?: Intl.DateTimeFormatOptions | undefined) => string;

declare const _default$a: (date: DateInput) => number;

declare const _default$9: (date: DateInput, baseDate: DateInput | undefined, locale: string, options?: Intl.RelativeTimeFormatOptions | undefined) => string;

declare const _default$8: (date: DateInput) => number;

declare const _default$7: (locale: string, intlOptions?: Intl.DateTimeFormatOptions | undefined) => string[];

declare const _default$6: (date1: DateInput, date2: DateInput) => boolean;

declare const _default$5: (date1: DateInput, date2: DateInput) => boolean;

declare const _default$4: (year: number) => boolean;

declare const _default$3: (date1: Date, date2: Date) => boolean;

declare const _default$2: (date: any) => boolean;

declare const _default$1: (dateString: string, locale: string) => Date | null;

declare const _default: (date: DateInput, value: number, unit: "days" | "months" | "years") => Date;

export { _default$f as add, _default$e as formatDate, _default$d as formatDateTime, _default$m as formatNumber, _default$j as formatNumberByParts, _default$h as formatPhoneNumber, _default$c as formatTime, _default$l as getCurrencyList, _default$k as getCurrencySymbol, _default$b as getFirstDayOfWeek, _default$a as getQuarter, _default$9 as getRelativeTime, _default$p as getState, _default$8 as getWeek, _default$7 as getWeekdays, _default$6 as isAfter, _default$5 as isBefore, _default$4 as isLeapYear, _default$3 as isSameDay, _default$2 as isValidDate, _default$i as isValidPhoneNumber, _default$1 as parseDate, _default$g as parsePhoneNumber, _default$n as resetState, _default$o as setState, _default as subtract };
