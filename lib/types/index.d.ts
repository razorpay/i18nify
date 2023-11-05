declare const CURRENCIES: {
    INR: {
        name: string;
    };
    USD: {
        name: string;
    };
};
declare function export_default$2(currency: keyof typeof CURRENCIES, amount: number, options?: Record<string, unknown>): string;

declare function export_default$1(label: string): void;

declare const COUNTRY_PHONE_REGEX: {
    IN: RegExp;
};
declare function export_default(phone: string, country: keyof typeof COUNTRY_PHONE_REGEX): boolean;

export { export_default$2 as formatCurrency, export_default$1 as logger, export_default as validatePhone };
