declare const _default$5: (amount: string | number, options?: {
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

declare const _default$4: () => GetCurrencyListOutput;

declare const _default$3: (currencyCode: string | number) => string;

declare const _default$2: (amount: string | number, options?: {
    currency?: string | number;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
}) => ByParts;

declare const _default$1: (phoneNumber: string | number, countryCode?: string | number) => boolean;

declare const _default: (phoneNumber: string | number, countryCode?: string | number) => string;

export { _default$5 as formatNumber, _default$2 as formatNumberByParts, _default as formatPhoneNumber, _default$4 as getCurrencyList, _default$3 as getCurrencySymbol, _default$1 as validatePhoneNumber };
