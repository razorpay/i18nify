declare const _default$3: (amount: string | number, options?: {
    currency?: string | number | undefined;
    locale?: string | undefined;
    intlOptions?: Intl.NumberFormatOptions | undefined;
} | undefined) => string;

declare const _default$2: () => {
    [key: string]: {
        symbol: string;
        name: string;
    };
};

declare const _default$1: (currencyCode: string | number) => string;

interface ByParts {
    currencySymbol: string;
    integerValue: string;
    decimalValue: string;
    separator: string;
    symbolAtFirst: boolean;
}

declare const _default: (amount: string | number, options?: {
    currency?: string | number | undefined;
    locale?: string | undefined;
    intlOptions?: Intl.NumberFormatOptions | undefined;
} | undefined) => ByParts;

export { _default$3 as formatNumber, _default as formatNumberByParts, _default$2 as getCurrencyList, _default$1 as getCurrencySymbol };
