declare module "i18nify/currency" {
  interface Currency {
    symbol: string;
    name: string;
  }

  export interface GetCurrencyListOutput {
    [currencyCode: string]: Currency;
  }

  export function formatAmount(
    currency_code: string,
    amount: string,
    options?: {
      locale?: string;
      withSymbol?: boolean;
      currencyDisplay?: "code" | "symbol" | "narrowSymbol" | "name";
    }
  ): string;

  export function getCurrencyList(): GetCurrencyListOutput;

  export function getCurrencySymbol(currency_code: string): string;
}
