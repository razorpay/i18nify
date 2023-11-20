declare const _default$6: (amount: string | number, options?: {
    currency?: string | number;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
}) => string;

interface Currency {
    symbol: string;
    name: string;
}
interface GetCurrencyListOutput {
    [currencyCode: keyof typeof CURRENCIES]: Currency;
}
interface ByParts {
    currencySymbol: string;
    integerValue: string;
    decimalValue: string;
    separator: string;
    symbolAtFirst: boolean;
}

declare const _default$5: () => GetCurrencyListOutput;

declare const _default$4: (currencyCode: string | number) => string;

declare const _default$3: (amount: string | number, options?: {
    currency?: string | number;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
}) => ByParts;

declare const _default$2: (phoneNumber: string | number, countryCode?: string | number) => boolean;

declare const _default$1: (phoneNumber: string | number, countryCode?: string | number) => string;

interface PhoneInfo {
    countryCode: string;
    dialCode: string;
    formattedPhoneNumber: string;
    formatTemplate: string;
}
declare const _default: (phoneNumber: string) => PhoneInfo;

export { _default$6 as formatNumber, _default$3 as formatNumberByParts, _default$1 as formatPhoneNumber, _default$5 as getCurrencyList, _default$4 as getCurrencySymbol, _default as parsePhoneNumber, _default$2 as validatePhoneNumber };
