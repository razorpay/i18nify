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

declare const _default: (amount: string | number, options?: {
    currency?: string | number | undefined;
    locale?: string | undefined;
    intlOptions?: Intl.NumberFormatOptions | undefined;
} | undefined) => ByParts;

export { _default$3 as formatNumber, _default as formatNumberByParts, _default$2 as getCurrencyList, _default$1 as getCurrencySymbol };
