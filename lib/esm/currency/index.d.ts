declare const CURRENCIES: {
    INR: {
        name: string;
    };
    USD: {
        name: string;
    };
};
declare function export_default$1(currency: keyof typeof CURRENCIES, amount: number, options?: Record<string, unknown>): string;

declare function export_default(label: string): void;

export { export_default$1 as formatCurrency, export_default as logger };
