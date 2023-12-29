interface I18nState {
    locale: string;
    direction: 'ltr' | 'rtl' | string;
    country: string;
}

declare const _default$9: () => I18nState;

declare const _default$8: (newState: Partial<I18nState>) => void;

declare const _default$7: () => void;

declare const _default$6: (amount: string | number, options?: {
    currency?: string | number | undefined;
    locale?: string | undefined;
    intlOptions?: Intl.NumberFormatOptions | undefined;
} | undefined) => string;

declare const _default$5: () => {
    [key: string]: {
        symbol: string;
        name: string;
    };
};

declare const _default$4: (currencyCode: string | number) => string;

interface ByParts {
    currencySymbol: string;
    integerValue: string;
    decimalValue: string;
    separator: string;
    symbolAtFirst: boolean;
}

declare const _default$3: (amount: string | number, options?: {
    currency?: string | number | undefined;
    locale?: string | undefined;
    intlOptions?: Intl.NumberFormatOptions | undefined;
} | undefined) => ByParts;

declare const _default$2: (phoneNumber: string | number, countryCode?: string | number | undefined) => boolean;

declare const _default$1: (phoneNumber: string | number, countryCode?: string | number | undefined) => string;

interface PhoneInfo {
    countryCode: string;
    dialCode: string;
    formattedPhoneNumber: string;
    formatTemplate: string;
}
declare const _default: (phoneNumber: string, country?: string | undefined) => PhoneInfo;

export { _default$6 as formatNumber, _default$3 as formatNumberByParts, _default$1 as formatPhoneNumber, _default$5 as getCurrencyList, _default$4 as getCurrencySymbol, _default$9 as getState, _default$2 as isValidPhoneNumber, _default as parsePhoneNumber, _default$7 as resetState, _default$8 as setState };
