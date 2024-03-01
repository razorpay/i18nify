interface I18nState {
    locale: string;
    direction: 'ltr' | 'rtl' | string;
    country: string;
}

declare const _default$r: () => I18nState;

declare const _default$q: (newState: Partial<I18nState>) => void;

declare const _default$p: () => void;

declare const ALLOWED_FORMAT_PARTS_KEYS$1: readonly ["nan", "infinity", "percent", "integer", "group", "decimal", "fraction", "plusSign", "minusSign", "percentSign", "currency", "code", "symbol", "name", "compact", "exponentInteger", "exponentMinusSign", "exponentSeparator", "unit"];

declare const CURRENCIES: {
    readonly AED: {
        readonly symbol: "د.إ";
        readonly name: "United Arab Emirates Dirham";
        readonly lowerUnitName: "Fils";
    };
    readonly ALL: {
        readonly symbol: "Lek";
        readonly name: "Albanian Lek";
        readonly lowerUnitName: "Qindarka";
    };
    readonly AMD: {
        readonly symbol: "֏";
        readonly name: "Armenian Dram";
        readonly lowerUnitName: "Luma";
    };
    readonly ARS: {
        readonly symbol: "ARS";
        readonly name: "Argentine Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly AUD: {
        readonly symbol: "A$";
        readonly name: "Australian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly AWG: {
        readonly symbol: "Afl.";
        readonly name: "Aruban Florin";
        readonly lowerUnitName: "Cent";
    };
    readonly BBD: {
        readonly symbol: "$";
        readonly name: "Barbadian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly BDT: {
        readonly symbol: "৳";
        readonly name: "Bangladeshi Taka";
        readonly lowerUnitName: "Poisha";
    };
    readonly BMD: {
        readonly symbol: "$";
        readonly name: "Bermudian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly BND: {
        readonly symbol: "BND";
        readonly name: "Brunei Dollar";
        readonly lowerUnitName: "Sen";
    };
    readonly BOB: {
        readonly symbol: "Bs";
        readonly name: "Bolivian Boliviano";
        readonly lowerUnitName: "Centavo";
    };
    readonly BSD: {
        readonly symbol: "B$";
        readonly name: "Bahamian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly BWP: {
        readonly symbol: "P";
        readonly name: "Botswanan Pula";
        readonly lowerUnitName: "Thebe";
    };
    readonly BZD: {
        readonly symbol: "BZ$";
        readonly name: "Belize Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly CAD: {
        readonly symbol: "C$";
        readonly name: "Canadian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly CHF: {
        readonly symbol: "CHf";
        readonly name: "Swiss Franc";
        readonly lowerUnitName: "Rappen";
    };
    readonly CNY: {
        readonly symbol: "¥";
        readonly name: "Chinese Yuan";
        readonly lowerUnitName: "Fen";
    };
    readonly COP: {
        readonly symbol: "COL$";
        readonly name: "Colombian Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly CRC: {
        readonly symbol: "₡";
        readonly name: "Costa Rican Colón";
        readonly lowerUnitName: "Céntimo";
    };
    readonly CUP: {
        readonly symbol: "$MN";
        readonly name: "Cuban Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly CZK: {
        readonly symbol: "Kč";
        readonly name: "Czech Koruna";
        readonly lowerUnitName: "Haléř";
    };
    readonly DKK: {
        readonly symbol: "DKK";
        readonly name: "Danish Krone";
        readonly lowerUnitName: "Øre";
    };
    readonly DOP: {
        readonly symbol: "RD$";
        readonly name: "Dominican Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly DZD: {
        readonly symbol: "د.ج";
        readonly name: "Algerian Dinar";
        readonly lowerUnitName: "Santeem";
    };
    readonly EGP: {
        readonly symbol: "E£";
        readonly name: "Egyptian Pound";
        readonly lowerUnitName: "Piastre";
    };
    readonly ETB: {
        readonly symbol: "ብር";
        readonly name: "Ethiopian Birr";
        readonly lowerUnitName: "Santim";
    };
    readonly EUR: {
        readonly symbol: "€";
        readonly name: "Euro";
        readonly lowerUnitName: "Cent";
    };
    readonly FJD: {
        readonly symbol: "FJ$";
        readonly name: "Fijian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly GBP: {
        readonly symbol: "£";
        readonly name: "British Pound";
        readonly lowerUnitName: "Penny";
    };
    readonly GHS: {
        readonly symbol: "GH₵";
        readonly name: "Ghanaian Cedi";
        readonly lowerUnitName: "Pesewa";
    };
    readonly GIP: {
        readonly symbol: "GIP";
        readonly name: "Gibraltar Pound";
        readonly lowerUnitName: "Penny";
    };
    readonly GMD: {
        readonly symbol: "D";
        readonly name: "Gambian Dalasi";
        readonly lowerUnitName: "Butut";
    };
    readonly GTQ: {
        readonly symbol: "Q";
        readonly name: "Guatemalan Quetzal";
        readonly lowerUnitName: "Centavo";
    };
    readonly GYD: {
        readonly symbol: "G$";
        readonly name: "Guyanese Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly HKD: {
        readonly symbol: "HK$";
        readonly name: "Hong Kong Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly HNL: {
        readonly symbol: "HNL";
        readonly name: "Honduran Lempira";
        readonly lowerUnitName: "Centavo";
    };
    readonly HRK: {
        readonly symbol: "kn";
        readonly name: "Croatian Kuna";
        readonly lowerUnitName: "Lipa";
    };
    readonly HTG: {
        readonly symbol: "G";
        readonly name: "Haitian Gourde";
        readonly lowerUnitName: "Centime";
    };
    readonly HUF: {
        readonly symbol: "Ft";
        readonly name: "Hungarian Forint";
        readonly lowerUnitName: "Fillér";
    };
    readonly IDR: {
        readonly symbol: "Rp";
        readonly name: "Indonesian Rupiah";
        readonly lowerUnitName: "Sen";
    };
    readonly ILS: {
        readonly symbol: "₪";
        readonly name: "Israeli New Shekel";
        readonly lowerUnitName: "Agora";
    };
    readonly INR: {
        readonly symbol: "₹";
        readonly name: "Indian Rupee";
        readonly lowerUnitName: "Paisa";
    };
    readonly JMD: {
        readonly symbol: "J$";
        readonly name: "Jamaican Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly KES: {
        readonly symbol: "Ksh";
        readonly name: "Kenyan Shilling";
        readonly lowerUnitName: "Cent";
    };
    readonly KGS: {
        readonly symbol: "Лв";
        readonly name: "Kyrgystani Som";
        readonly lowerUnitName: "Tyiyn";
    };
    readonly KHR: {
        readonly symbol: "៛";
        readonly name: "Cambodian Riel";
        readonly lowerUnitName: "Sen";
    };
    readonly KYD: {
        readonly symbol: "CI$";
        readonly name: "Cayman Islands Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly KZT: {
        readonly symbol: "₸";
        readonly name: "Kazakhstani Tenge";
        readonly lowerUnitName: "Tiyn";
    };
    readonly LAK: {
        readonly symbol: "₭";
        readonly name: "Laotian Kip";
        readonly lowerUnitName: "Att";
    };
    readonly LKR: {
        readonly symbol: "රු";
        readonly name: "Sri Lankan Rupee";
        readonly lowerUnitName: "Cent";
    };
    readonly LRD: {
        readonly symbol: "L$";
        readonly name: "Liberian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly LSL: {
        readonly symbol: "LSL";
        readonly name: "Lesotho Loti";
        readonly lowerUnitName: "Sente";
    };
    readonly MAD: {
        readonly symbol: "د.م.";
        readonly name: "Moroccan Dirham";
        readonly lowerUnitName: "Centime";
    };
    readonly MDL: {
        readonly symbol: "MDL";
        readonly name: "Moldovan Leu";
        readonly lowerUnitName: "Ban";
    };
    readonly MKD: {
        readonly symbol: "ден";
        readonly name: "Macedonian Denar";
        readonly lowerUnitName: "Deni";
    };
    readonly MMK: {
        readonly symbol: "MMK";
        readonly name: "Myanmar Kyat";
        readonly lowerUnitName: "Pya";
    };
    readonly MNT: {
        readonly symbol: "₮";
        readonly name: "Mongolian Tugrik";
        readonly lowerUnitName: "Möngö";
    };
    readonly MOP: {
        readonly symbol: "MOP$";
        readonly name: "Macanese Pataca";
        readonly lowerUnitName: "Avo";
    };
    readonly MUR: {
        readonly symbol: "₨";
        readonly name: "Mauritian Rupee";
        readonly lowerUnitName: "Cent";
    };
    readonly MVR: {
        readonly symbol: "Rf";
        readonly name: "Maldivian Rufiyaa";
        readonly lowerUnitName: "Laari";
    };
    readonly MWK: {
        readonly symbol: "MK";
        readonly name: "Malawian Kwacha";
        readonly lowerUnitName: "Tambala";
    };
    readonly MXN: {
        readonly symbol: "Mex$";
        readonly name: "Mexican Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly MYR: {
        readonly symbol: "RM";
        readonly name: "Malaysian Ringgit";
        readonly lowerUnitName: "Sen";
    };
    readonly NAD: {
        readonly symbol: "N$";
        readonly name: "Namibian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly NGN: {
        readonly symbol: "₦";
        readonly name: "Nigerian Naira";
        readonly lowerUnitName: "Kobo";
    };
    readonly NIO: {
        readonly symbol: "NIO";
        readonly name: "Nicaraguan Córdoba";
        readonly lowerUnitName: "Centavo";
    };
    readonly NOK: {
        readonly symbol: "NOK";
        readonly name: "Norwegian Krone";
        readonly lowerUnitName: "Øre";
    };
    readonly NPR: {
        readonly symbol: "रू";
        readonly name: "Nepalese Rupee";
        readonly lowerUnitName: "Paisa";
    };
    readonly NZD: {
        readonly symbol: "NZ$";
        readonly name: "New Zealand Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly PEN: {
        readonly symbol: "S/";
        readonly name: "Peruvian Nuevo Sol";
        readonly lowerUnitName: "Céntimo";
    };
    readonly PGK: {
        readonly symbol: "PGK";
        readonly name: "Papua New Guinean Kina";
        readonly lowerUnitName: "Toea";
    };
    readonly PHP: {
        readonly symbol: "₱";
        readonly name: "Philippine Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly PKR: {
        readonly symbol: "₨";
        readonly name: "Pakistani Rupee";
        readonly lowerUnitName: "Paisa";
    };
    readonly QAR: {
        readonly symbol: "QR";
        readonly name: "Qatari Riyal";
        readonly lowerUnitName: "Dirham";
    };
    readonly RUB: {
        readonly symbol: "₽";
        readonly name: "Russian Ruble";
        readonly lowerUnitName: "Kopeck";
    };
    readonly SAR: {
        readonly symbol: "SR";
        readonly name: "Saudi Riyal";
        readonly lowerUnitName: "Halala";
    };
    readonly SCR: {
        readonly symbol: "SRe";
        readonly name: "Seychellois Rupee";
        readonly lowerUnitName: "Cent";
    };
    readonly SEK: {
        readonly symbol: "SEK";
        readonly name: "Swedish Krona";
        readonly lowerUnitName: "Öre";
    };
    readonly SGD: {
        readonly symbol: "S$";
        readonly name: "Singapore Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly SLL: {
        readonly symbol: "Le";
        readonly name: "Sierra Leonean Leone";
        readonly lowerUnitName: "Cent";
    };
    readonly SOS: {
        readonly symbol: "Sh.so.";
        readonly name: "Somali Shilling";
        readonly lowerUnitName: "Senti";
    };
    readonly SSP: {
        readonly symbol: "SS£";
        readonly name: "South Sudanese Pound";
        readonly lowerUnitName: "Piaster";
    };
    readonly SVC: {
        readonly symbol: "₡";
        readonly name: "Salvadoran Colón";
        readonly lowerUnitName: "Centavo";
    };
    readonly SZL: {
        readonly symbol: "E";
        readonly name: "Swazi Lilangeni";
        readonly lowerUnitName: "Cent";
    };
    readonly THB: {
        readonly symbol: "฿";
        readonly name: "Thai Baht";
        readonly lowerUnitName: "Satang";
    };
    readonly TTD: {
        readonly symbol: "TT$";
        readonly name: "Trinidad and Tobago Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly TZS: {
        readonly symbol: "Sh";
        readonly name: "Tanzanian Shilling";
        readonly lowerUnitName: "Cent";
    };
    readonly USD: {
        readonly symbol: "$";
        readonly name: "United States Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly UYU: {
        readonly symbol: "$U";
        readonly name: "Uruguayan Peso";
        readonly lowerUnitName: "Centésimo";
    };
    readonly UZS: {
        readonly symbol: "so'm";
        readonly name: "Uzbekistani Som";
        readonly lowerUnitName: "Tiyin";
    };
    readonly YER: {
        readonly symbol: "﷼";
        readonly name: "Yemeni Rial";
        readonly lowerUnitName: "Fils";
    };
    readonly ZAR: {
        readonly symbol: "R";
        readonly name: "South African Rand";
        readonly lowerUnitName: "Cent";
    };
    readonly KWD: {
        readonly symbol: "د.ك";
        readonly name: "Kuwaiti Dinar";
        readonly lowerUnitName: "Fils";
        readonly minorUnitMultiplier: 1000;
    };
    readonly BHD: {
        readonly symbol: "د.ب.";
        readonly name: "Bahraini Dinar";
        readonly lowerUnitName: "Fils";
        readonly minorUnitMultiplier: 1000;
    };
    readonly OMR: {
        readonly symbol: "ر.ع.";
        readonly name: "Omani Rial";
        readonly lowerUnitName: "Baisa";
        readonly minorUnitMultiplier: 1000;
    };
    readonly JPY: {
        readonly symbol: "¥";
        readonly name: "Japanese Yen";
        readonly lowerUnitName: "";
        readonly minorUnitMultiplier: 1;
    };
};

type FormattedPartsObject$1 = {
    [key in (typeof ALLOWED_FORMAT_PARTS_KEYS$1)[number]]?: string | undefined;
};
interface ByParts extends FormattedPartsObject$1 {
    isPrefixSymbol: boolean;
    rawParts: Array<{
        type: string;
        value: unknown;
    }>;
}
interface I18nifyNumberFormatOptions {
    numberingSystem?: string;
    currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name' | undefined;
    currencySign?: 'standard' | 'accounting' | undefined;
    roundingPriority?: 'auto' | 'morePrecision' | 'lessPrecision';
    roundingIncrement?: number;
    roundingMode?: 'ceil' | 'floor' | 'expand' | 'trunc' | 'halfCeil' | 'halfFloor' | 'halfExpand' | 'halfTrunc' | 'halfEven';
    trailingZeroDisplay?: 'auto' | 'stripIfInteger';
    useGrouping?: 'always' | 'auto' | 'min2' | true | false | undefined;
    signDisplay?: 'auto' | 'always' | 'exceptZero' | 'negative' | 'never' | undefined;
    compactDisplay?: 'short' | 'long' | undefined;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact' | undefined;
    unit?: string | undefined;
    unitDisplay?: 'short' | 'long' | 'narrow' | undefined;
    localeMatcher?: string | undefined;
    style?: string | undefined;
    currency?: string | undefined;
    minimumIntegerDigits?: number | undefined;
    minimumFractionDigits?: number | undefined;
    maximumFractionDigits?: number | undefined;
    minimumSignificantDigits?: number | undefined;
    maximumSignificantDigits?: number | undefined;
}
type CurrencyCodeType = keyof typeof CURRENCIES;

declare const _default$o: (amount: string | number, options?: {
    currency?: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY" | undefined;
    locale?: string | undefined;
    intlOptions?: I18nifyNumberFormatOptions | undefined;
} | undefined) => string;

declare const _default$n: () => {
    readonly AED: {
        readonly symbol: "د.إ";
        readonly name: "United Arab Emirates Dirham";
        readonly lowerUnitName: "Fils";
    };
    readonly ALL: {
        readonly symbol: "Lek";
        readonly name: "Albanian Lek";
        readonly lowerUnitName: "Qindarka";
    };
    readonly AMD: {
        readonly symbol: "֏";
        readonly name: "Armenian Dram";
        readonly lowerUnitName: "Luma";
    };
    readonly ARS: {
        readonly symbol: "ARS";
        readonly name: "Argentine Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly AUD: {
        readonly symbol: "A$";
        readonly name: "Australian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly AWG: {
        readonly symbol: "Afl.";
        readonly name: "Aruban Florin";
        readonly lowerUnitName: "Cent";
    };
    readonly BBD: {
        readonly symbol: "$";
        readonly name: "Barbadian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly BDT: {
        readonly symbol: "৳";
        readonly name: "Bangladeshi Taka";
        readonly lowerUnitName: "Poisha";
    };
    readonly BMD: {
        readonly symbol: "$";
        readonly name: "Bermudian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly BND: {
        readonly symbol: "BND";
        readonly name: "Brunei Dollar";
        readonly lowerUnitName: "Sen";
    };
    readonly BOB: {
        readonly symbol: "Bs";
        readonly name: "Bolivian Boliviano";
        readonly lowerUnitName: "Centavo";
    };
    readonly BSD: {
        readonly symbol: "B$";
        readonly name: "Bahamian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly BWP: {
        readonly symbol: "P";
        readonly name: "Botswanan Pula";
        readonly lowerUnitName: "Thebe";
    };
    readonly BZD: {
        readonly symbol: "BZ$";
        readonly name: "Belize Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly CAD: {
        readonly symbol: "C$";
        readonly name: "Canadian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly CHF: {
        readonly symbol: "CHf";
        readonly name: "Swiss Franc";
        readonly lowerUnitName: "Rappen";
    };
    readonly CNY: {
        readonly symbol: "¥";
        readonly name: "Chinese Yuan";
        readonly lowerUnitName: "Fen";
    };
    readonly COP: {
        readonly symbol: "COL$";
        readonly name: "Colombian Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly CRC: {
        readonly symbol: "₡";
        readonly name: "Costa Rican Colón";
        readonly lowerUnitName: "Céntimo";
    };
    readonly CUP: {
        readonly symbol: "$MN";
        readonly name: "Cuban Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly CZK: {
        readonly symbol: "Kč";
        readonly name: "Czech Koruna";
        readonly lowerUnitName: "Haléř";
    };
    readonly DKK: {
        readonly symbol: "DKK";
        readonly name: "Danish Krone";
        readonly lowerUnitName: "Øre";
    };
    readonly DOP: {
        readonly symbol: "RD$";
        readonly name: "Dominican Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly DZD: {
        readonly symbol: "د.ج";
        readonly name: "Algerian Dinar";
        readonly lowerUnitName: "Santeem";
    };
    readonly EGP: {
        readonly symbol: "E£";
        readonly name: "Egyptian Pound";
        readonly lowerUnitName: "Piastre";
    };
    readonly ETB: {
        readonly symbol: "ብር";
        readonly name: "Ethiopian Birr";
        readonly lowerUnitName: "Santim";
    };
    readonly EUR: {
        readonly symbol: "€";
        readonly name: "Euro";
        readonly lowerUnitName: "Cent";
    };
    readonly FJD: {
        readonly symbol: "FJ$";
        readonly name: "Fijian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly GBP: {
        readonly symbol: "£";
        readonly name: "British Pound";
        readonly lowerUnitName: "Penny";
    };
    readonly GHS: {
        readonly symbol: "GH₵";
        readonly name: "Ghanaian Cedi";
        readonly lowerUnitName: "Pesewa";
    };
    readonly GIP: {
        readonly symbol: "GIP";
        readonly name: "Gibraltar Pound";
        readonly lowerUnitName: "Penny";
    };
    readonly GMD: {
        readonly symbol: "D";
        readonly name: "Gambian Dalasi";
        readonly lowerUnitName: "Butut";
    };
    readonly GTQ: {
        readonly symbol: "Q";
        readonly name: "Guatemalan Quetzal";
        readonly lowerUnitName: "Centavo";
    };
    readonly GYD: {
        readonly symbol: "G$";
        readonly name: "Guyanese Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly HKD: {
        readonly symbol: "HK$";
        readonly name: "Hong Kong Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly HNL: {
        readonly symbol: "HNL";
        readonly name: "Honduran Lempira";
        readonly lowerUnitName: "Centavo";
    };
    readonly HRK: {
        readonly symbol: "kn";
        readonly name: "Croatian Kuna";
        readonly lowerUnitName: "Lipa";
    };
    readonly HTG: {
        readonly symbol: "G";
        readonly name: "Haitian Gourde";
        readonly lowerUnitName: "Centime";
    };
    readonly HUF: {
        readonly symbol: "Ft";
        readonly name: "Hungarian Forint";
        readonly lowerUnitName: "Fillér";
    };
    readonly IDR: {
        readonly symbol: "Rp";
        readonly name: "Indonesian Rupiah";
        readonly lowerUnitName: "Sen";
    };
    readonly ILS: {
        readonly symbol: "₪";
        readonly name: "Israeli New Shekel";
        readonly lowerUnitName: "Agora";
    };
    readonly INR: {
        readonly symbol: "₹";
        readonly name: "Indian Rupee";
        readonly lowerUnitName: "Paisa";
    };
    readonly JMD: {
        readonly symbol: "J$";
        readonly name: "Jamaican Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly KES: {
        readonly symbol: "Ksh";
        readonly name: "Kenyan Shilling";
        readonly lowerUnitName: "Cent";
    };
    readonly KGS: {
        readonly symbol: "Лв";
        readonly name: "Kyrgystani Som";
        readonly lowerUnitName: "Tyiyn";
    };
    readonly KHR: {
        readonly symbol: "៛";
        readonly name: "Cambodian Riel";
        readonly lowerUnitName: "Sen";
    };
    readonly KYD: {
        readonly symbol: "CI$";
        readonly name: "Cayman Islands Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly KZT: {
        readonly symbol: "₸";
        readonly name: "Kazakhstani Tenge";
        readonly lowerUnitName: "Tiyn";
    };
    readonly LAK: {
        readonly symbol: "₭";
        readonly name: "Laotian Kip";
        readonly lowerUnitName: "Att";
    };
    readonly LKR: {
        readonly symbol: "රු";
        readonly name: "Sri Lankan Rupee";
        readonly lowerUnitName: "Cent";
    };
    readonly LRD: {
        readonly symbol: "L$";
        readonly name: "Liberian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly LSL: {
        readonly symbol: "LSL";
        readonly name: "Lesotho Loti";
        readonly lowerUnitName: "Sente";
    };
    readonly MAD: {
        readonly symbol: "د.م.";
        readonly name: "Moroccan Dirham";
        readonly lowerUnitName: "Centime";
    };
    readonly MDL: {
        readonly symbol: "MDL";
        readonly name: "Moldovan Leu";
        readonly lowerUnitName: "Ban";
    };
    readonly MKD: {
        readonly symbol: "ден";
        readonly name: "Macedonian Denar";
        readonly lowerUnitName: "Deni";
    };
    readonly MMK: {
        readonly symbol: "MMK";
        readonly name: "Myanmar Kyat";
        readonly lowerUnitName: "Pya";
    };
    readonly MNT: {
        readonly symbol: "₮";
        readonly name: "Mongolian Tugrik";
        readonly lowerUnitName: "Möngö";
    };
    readonly MOP: {
        readonly symbol: "MOP$";
        readonly name: "Macanese Pataca";
        readonly lowerUnitName: "Avo";
    };
    readonly MUR: {
        readonly symbol: "₨";
        readonly name: "Mauritian Rupee";
        readonly lowerUnitName: "Cent";
    };
    readonly MVR: {
        readonly symbol: "Rf";
        readonly name: "Maldivian Rufiyaa";
        readonly lowerUnitName: "Laari";
    };
    readonly MWK: {
        readonly symbol: "MK";
        readonly name: "Malawian Kwacha";
        readonly lowerUnitName: "Tambala";
    };
    readonly MXN: {
        readonly symbol: "Mex$";
        readonly name: "Mexican Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly MYR: {
        readonly symbol: "RM";
        readonly name: "Malaysian Ringgit";
        readonly lowerUnitName: "Sen";
    };
    readonly NAD: {
        readonly symbol: "N$";
        readonly name: "Namibian Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly NGN: {
        readonly symbol: "₦";
        readonly name: "Nigerian Naira";
        readonly lowerUnitName: "Kobo";
    };
    readonly NIO: {
        readonly symbol: "NIO";
        readonly name: "Nicaraguan Córdoba";
        readonly lowerUnitName: "Centavo";
    };
    readonly NOK: {
        readonly symbol: "NOK";
        readonly name: "Norwegian Krone";
        readonly lowerUnitName: "Øre";
    };
    readonly NPR: {
        readonly symbol: "रू";
        readonly name: "Nepalese Rupee";
        readonly lowerUnitName: "Paisa";
    };
    readonly NZD: {
        readonly symbol: "NZ$";
        readonly name: "New Zealand Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly PEN: {
        readonly symbol: "S/";
        readonly name: "Peruvian Nuevo Sol";
        readonly lowerUnitName: "Céntimo";
    };
    readonly PGK: {
        readonly symbol: "PGK";
        readonly name: "Papua New Guinean Kina";
        readonly lowerUnitName: "Toea";
    };
    readonly PHP: {
        readonly symbol: "₱";
        readonly name: "Philippine Peso";
        readonly lowerUnitName: "Centavo";
    };
    readonly PKR: {
        readonly symbol: "₨";
        readonly name: "Pakistani Rupee";
        readonly lowerUnitName: "Paisa";
    };
    readonly QAR: {
        readonly symbol: "QR";
        readonly name: "Qatari Riyal";
        readonly lowerUnitName: "Dirham";
    };
    readonly RUB: {
        readonly symbol: "₽";
        readonly name: "Russian Ruble";
        readonly lowerUnitName: "Kopeck";
    };
    readonly SAR: {
        readonly symbol: "SR";
        readonly name: "Saudi Riyal";
        readonly lowerUnitName: "Halala";
    };
    readonly SCR: {
        readonly symbol: "SRe";
        readonly name: "Seychellois Rupee";
        readonly lowerUnitName: "Cent";
    };
    readonly SEK: {
        readonly symbol: "SEK";
        readonly name: "Swedish Krona";
        readonly lowerUnitName: "Öre";
    };
    readonly SGD: {
        readonly symbol: "S$";
        readonly name: "Singapore Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly SLL: {
        readonly symbol: "Le";
        readonly name: "Sierra Leonean Leone";
        readonly lowerUnitName: "Cent";
    };
    readonly SOS: {
        readonly symbol: "Sh.so.";
        readonly name: "Somali Shilling";
        readonly lowerUnitName: "Senti";
    };
    readonly SSP: {
        readonly symbol: "SS£";
        readonly name: "South Sudanese Pound";
        readonly lowerUnitName: "Piaster";
    };
    readonly SVC: {
        readonly symbol: "₡";
        readonly name: "Salvadoran Colón";
        readonly lowerUnitName: "Centavo";
    };
    readonly SZL: {
        readonly symbol: "E";
        readonly name: "Swazi Lilangeni";
        readonly lowerUnitName: "Cent";
    };
    readonly THB: {
        readonly symbol: "฿";
        readonly name: "Thai Baht";
        readonly lowerUnitName: "Satang";
    };
    readonly TTD: {
        readonly symbol: "TT$";
        readonly name: "Trinidad and Tobago Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly TZS: {
        readonly symbol: "Sh";
        readonly name: "Tanzanian Shilling";
        readonly lowerUnitName: "Cent";
    };
    readonly USD: {
        readonly symbol: "$";
        readonly name: "United States Dollar";
        readonly lowerUnitName: "Cent";
    };
    readonly UYU: {
        readonly symbol: "$U";
        readonly name: "Uruguayan Peso";
        readonly lowerUnitName: "Centésimo";
    };
    readonly UZS: {
        readonly symbol: "so'm";
        readonly name: "Uzbekistani Som";
        readonly lowerUnitName: "Tiyin";
    };
    readonly YER: {
        readonly symbol: "﷼";
        readonly name: "Yemeni Rial";
        readonly lowerUnitName: "Fils";
    };
    readonly ZAR: {
        readonly symbol: "R";
        readonly name: "South African Rand";
        readonly lowerUnitName: "Cent";
    };
    readonly KWD: {
        readonly symbol: "د.ك";
        readonly name: "Kuwaiti Dinar";
        readonly lowerUnitName: "Fils";
        readonly minorUnitMultiplier: 1000;
    };
    readonly BHD: {
        readonly symbol: "د.ب.";
        readonly name: "Bahraini Dinar";
        readonly lowerUnitName: "Fils";
        readonly minorUnitMultiplier: 1000;
    };
    readonly OMR: {
        readonly symbol: "ر.ع.";
        readonly name: "Omani Rial";
        readonly lowerUnitName: "Baisa";
        readonly minorUnitMultiplier: 1000;
    };
    readonly JPY: {
        readonly symbol: "¥";
        readonly name: "Japanese Yen";
        readonly lowerUnitName: "";
        readonly minorUnitMultiplier: 1;
    };
};

declare const _default$m: (currencyCode: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY") => string;

declare const _default$l: (amount: string | number, options?: {
    currency?: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY" | undefined;
    locale?: string | undefined;
    intlOptions?: I18nifyNumberFormatOptions | undefined;
} | undefined) => ByParts;

declare const _default$k: (amount: number, options: {
    currency: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY";
}) => number;

declare const _default$j: (amount: number, options: {
    currency: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY";
}) => number;

type CountryCodeType = 'US' | 'AQ' | 'AG' | 'AI' | 'AS' | 'BB' | 'BM' | 'BS' | 'CA' | 'DM' | 'DO' | 'GD' | 'GU' | 'JM' | 'KN' | 'KY' | 'LC' | 'MP' | 'MS' | 'PR' | 'SX' | 'TC' | 'TT' | 'VC' | 'VG' | 'VI' | 'RU' | 'KZ' | 'EG' | 'ZA' | 'GR' | 'NL' | 'BE' | 'FR' | 'ES' | 'HU' | 'IT' | 'VA' | 'RO' | 'CH' | 'AT' | 'GB' | 'GG' | 'IM' | 'JE' | 'DK' | 'SE' | 'NO' | 'SJ' | 'PL' | 'DE' | 'PE' | 'MX' | 'CU' | 'AR' | 'BR' | 'CL' | 'CO' | 'VE' | 'MY' | 'AU' | 'CC' | 'CX' | 'ID' | 'PH' | 'NZ' | 'SG' | 'TH' | 'JP' | 'KR' | 'VN' | 'CN' | 'TR' | 'IN' | 'PK' | 'AF' | 'LK' | 'MM' | 'IR' | 'SS' | 'MA' | 'EH' | 'DZ' | 'TN' | 'LY' | 'GM' | 'SN' | 'MR' | 'ML' | 'GN' | 'CI' | 'BF' | 'NE' | 'TG' | 'BJ' | 'MU' | 'LR' | 'SL' | 'GH' | 'NG' | 'TD' | 'CF' | 'CM' | 'CV' | 'ST' | 'GQ' | 'GA' | 'CG' | 'CD' | 'AO' | 'GW' | 'IO' | 'AC' | 'SC' | 'SD' | 'RW' | 'ET' | 'SO' | 'DJ' | 'KE' | 'TZ' | 'UG' | 'BI' | 'MZ' | 'ZM' | 'MG' | 'RE' | 'YT' | 'ZW' | 'NA' | 'MW' | 'LS' | 'BW' | 'SZ' | 'KM' | 'SH' | 'TA' | 'ER' | 'AW' | 'FO' | 'GL' | 'GI' | 'PT' | 'LU' | 'IE' | 'IS' | 'AL' | 'MT' | 'CY' | 'FI' | 'AX' | 'BG' | 'LT' | 'LV' | 'EE' | 'MD' | 'AM' | 'BY' | 'AD' | 'MC' | 'SM' | 'UA' | 'RS' | 'ME' | 'XK' | 'HR' | 'SI' | 'BA' | 'MK' | 'CZ' | 'SK' | 'LI' | 'FK' | 'BZ' | 'GT' | 'SV' | 'HN' | 'NI' | 'CR' | 'PA' | 'PM' | 'HT' | 'GP' | 'BL' | 'MF' | 'BO' | 'GY' | 'EC' | 'GF' | 'PY' | 'MQ' | 'SR' | 'UY' | 'CW' | 'BQ' | 'TL' | 'NF' | 'BN' | 'NR' | 'PG' | 'TO' | 'SB' | 'VU' | 'FJ' | 'PW' | 'WF' | 'CK' | 'NU' | 'WS' | 'KI' | 'NC' | 'TV' | 'PF' | 'TK' | 'FM' | 'MH' | 'KP' | 'HK' | 'MO' | 'KH' | 'LA' | 'BD' | 'TW' | 'MV' | 'LB' | 'JO' | 'SY' | 'IQ' | 'KW' | 'SA' | 'YE' | 'OM' | 'PS' | 'AE' | 'IL' | 'BH' | 'QA' | 'BT' | 'MN' | 'NP' | 'TJ' | 'TM' | 'AZ' | 'GE' | 'KG' | 'UZ' | 'EU';

declare const _default$i: (phoneNumber: string | number, countryCode?: CountryCodeType | undefined) => boolean;

declare const _default$h: (phoneNumber: string | number, countryCode?: CountryCodeType | undefined) => string;

interface PhoneInfo {
    countryCode: string;
    dialCode: string;
    formattedPhoneNumber: string;
    formatTemplate: string;
    phoneNumber: string;
}
declare const _default$g: (phoneNumber: string, country?: CountryCodeType | undefined) => PhoneInfo;

declare const _default$f: () => {
    MK: string;
    SR: string;
    US: string;
    AQ: string;
    AG: string;
    AI: string;
    AS: string;
    BB: string;
    BM: string;
    BS: string;
    CA: string;
    DM: string;
    DO: string;
    GD: string;
    GU: string;
    JM: string;
    KN: string;
    KY: string;
    LC: string;
    MP: string;
    MS: string;
    PR: string;
    SX: string;
    TC: string;
    TT: string;
    VC: string;
    VG: string;
    VI: string;
    RU: string;
    KZ: string;
    EG: string;
    ZA: string;
    GR: string;
    NL: string;
    BE: string;
    FR: string;
    ES: string;
    HU: string;
    IT: string;
    VA: string;
    RO: string;
    CH: string;
    AT: string;
    GB: string;
    GG: string;
    IM: string;
    JE: string;
    DK: string;
    SE: string;
    NO: string;
    SJ: string;
    PL: string;
    DE: string;
    PE: string;
    MX: string;
    CU: string;
    AR: string;
    BR: string;
    CL: string;
    CO: string;
    VE: string;
    MY: string;
    AU: string;
    CC: string;
    CX: string;
    ID: string;
    PH: string;
    NZ: string;
    SG: string;
    TH: string;
    JP: string;
    KR: string;
    VN: string;
    CN: string;
    TR: string;
    IN: string;
    PK: string;
    AF: string;
    LK: string;
    MM: string;
    IR: string;
    SS: string;
    MA: string;
    EH: string;
    DZ: string;
    TN: string;
    LY: string;
    GM: string;
    SN: string;
    MR: string;
    ML: string;
    GN: string;
    CI: string;
    BF: string;
    NE: string;
    TG: string;
    BJ: string;
    MU: string;
    LR: string;
    SL: string;
    GH: string;
    NG: string;
    TD: string;
    CF: string;
    CM: string;
    CV: string;
    ST: string;
    GQ: string;
    GA: string;
    CG: string;
    CD: string;
    AO: string;
    GW: string;
    IO: string;
    AC: string;
    SC: string;
    SD: string;
    RW: string;
    ET: string;
    SO: string;
    DJ: string;
    KE: string;
    TZ: string;
    UG: string;
    BI: string;
    MZ: string;
    ZM: string;
    MG: string;
    RE: string;
    YT: string;
    ZW: string;
    NA: string;
    MW: string;
    LS: string;
    BW: string;
    SZ: string;
    KM: string;
    SH: string;
    TA: string;
    ER: string;
    AW: string;
    FO: string;
    GL: string;
    GI: string;
    PT: string;
    LU: string;
    IE: string;
    IS: string;
    AL: string;
    MT: string;
    CY: string;
    FI: string;
    AX: string;
    BG: string;
    LT: string;
    LV: string;
    EE: string;
    MD: string;
    AM: string;
    BY: string;
    AD: string;
    MC: string;
    SM: string;
    UA: string;
    RS: string;
    ME: string;
    XK: string;
    HR: string;
    SI: string;
    BA: string;
    CZ: string;
    SK: string;
    LI: string;
    FK: string;
    BZ: string;
    GT: string;
    SV: string;
    HN: string;
    NI: string;
    CR: string;
    PA: string;
    PM: string;
    HT: string;
    GP: string;
    BL: string;
    MF: string;
    BO: string;
    GY: string;
    EC: string;
    GF: string;
    PY: string;
    MQ: string;
    UY: string;
    CW: string;
    BQ: string;
    TL: string;
    NF: string;
    BN: string;
    NR: string;
    PG: string;
    TO: string;
    SB: string;
    VU: string;
    FJ: string;
    PW: string;
    WF: string;
    CK: string;
    NU: string;
    WS: string;
    KI: string;
    NC: string;
    TV: string;
    PF: string;
    TK: string;
    FM: string;
    MH: string;
    KP: string;
    HK: string;
    MO: string;
    KH: string;
    LA: string;
    BD: string;
    TW: string;
    MV: string;
    LB: string;
    JO: string;
    SY: string;
    IQ: string;
    KW: string;
    SA: string;
    YE: string;
    OM: string;
    PS: string;
    AE: string;
    IL: string;
    BH: string;
    QA: string;
    BT: string;
    MN: string;
    NP: string;
    TJ: string;
    TM: string;
    AZ: string;
    GE: string;
    KG: string;
    UZ: string;
    EU: string;
};

declare const _default$e: (countryCode: CountryCodeType) => string;

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

declare const _default$d: (date: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: DateFormatOptions | undefined;
} | undefined) => string;

declare const _default$c: (date: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: Intl.DateTimeFormatOptions | undefined;
} | undefined) => string;

declare const _default$b: (date: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: TimeFormatOptions | undefined;
} | undefined) => string;

declare const _default$a: (date: DateInput, baseDate?: DateInput | undefined, options?: {
    locale?: string | undefined;
    intlOptions?: Intl.RelativeTimeFormatOptions | undefined;
} | undefined) => string;

declare const _default$9: (options: {
    locale?: string | undefined;
    intlOptions: Intl.DateTimeFormatOptions;
}) => string[];

declare const _default$8: (dateString: string) => boolean;

declare const _default$7: (dateInput: DateInput, options?: {
    locale?: string | undefined;
    intlOptions?: Intl.DateTimeFormatOptions | undefined;
} | undefined) => ParsedDateTime;

declare const _default$6: (countryCode: string) => Promise<string>;

type FlagMap = Record<string, string>;
type CONTINENT_CODE = 'AF' | 'AN' | 'AS' | 'EU' | 'NA' | 'OC' | 'SA';
type COUNTRY_CODE = 'AO' | 'BF' | 'BI' | 'BJ' | 'BW' | 'CD' | 'CF' | 'CG' | 'CI' | 'CM' | 'CV' | 'DJ' | 'DZ' | 'EG' | 'EH' | 'ER' | 'ET' | 'GA' | 'GH' | 'GM' | 'GN' | 'GQ' | 'GW' | 'KE' | 'KM' | 'LR' | 'LS' | 'LY' | 'MA' | 'MG' | 'ML' | 'MR' | 'MU' | 'MW' | 'MZ' | 'NA' | 'NE' | 'NG' | 'RE' | 'RW' | 'SC' | 'SD' | 'SH' | 'SL' | 'SN' | 'SO' | 'SS' | 'ST' | 'SZ' | 'TD' | 'TG' | 'TN' | 'TZ' | 'UG' | 'YT' | 'ZA' | 'ZM' | 'ZW' | 'AQ' | 'BV' | 'GS' | 'HM' | 'TF' | 'AE' | 'AF' | 'AM' | 'AZ' | 'BD' | 'BH' | 'BN' | 'BT' | 'CC' | 'CN' | 'GE' | 'HK' | 'ID' | 'IL' | 'IN' | 'IO' | 'IQ' | 'IR' | 'JO' | 'JP' | 'KG' | 'KH' | 'KP' | 'KR' | 'KW' | 'KZ' | 'LA' | 'LB' | 'LK' | 'MM' | 'MN' | 'MO' | 'MV' | 'MY' | 'NP' | 'OM' | 'PH' | 'PK' | 'PS' | 'QA' | 'SA' | 'SG' | 'SY' | 'TH' | 'TJ' | 'TM' | 'TR' | 'TW' | 'UZ' | 'VN' | 'YE' | 'AD' | 'AL' | 'AT' | 'AX' | 'BA' | 'BE' | 'BG' | 'BY' | 'CH' | 'CY' | 'CZ' | 'DE' | 'DK' | 'EE' | 'ES' | 'FI' | 'FO' | 'FR' | 'GB' | 'GG' | 'GI' | 'GR' | 'HR' | 'HU' | 'IE' | 'IM' | 'IS' | 'IT' | 'JE' | 'LI' | 'LT' | 'LU' | 'LV' | 'MC' | 'MD' | 'ME' | 'MK' | 'MT' | 'NL' | 'NO' | 'PL' | 'PT' | 'RO' | 'RS' | 'RU' | 'SE' | 'SI' | 'SJ' | 'SK' | 'SM' | 'UA' | 'VA' | 'XK' | 'AG' | 'AI' | 'AW' | 'BB' | 'BL' | 'BM' | 'BQ' | 'BS' | 'BZ' | 'CA' | 'CR' | 'CU' | 'CW' | 'DM' | 'DO' | 'GD' | 'GL' | 'GP' | 'GT' | 'HN' | 'HT' | 'JM' | 'KN' | 'KY' | 'LC' | 'MF' | 'MQ' | 'MS' | 'MX' | 'NI' | 'PA' | 'PM' | 'PR' | 'SV' | 'SX' | 'TC' | 'TT' | 'US' | 'VC' | 'VG' | 'VI' | 'AS' | 'AU' | 'CK' | 'CX' | 'FJ' | 'FM' | 'GU' | 'KI' | 'MH' | 'MP' | 'NC' | 'NF' | 'NR' | 'NU' | 'NZ' | 'PF' | 'PG' | 'PN' | 'PW' | 'SB' | 'TK' | 'TL' | 'TO' | 'TV' | 'UM' | 'VU' | 'WF' | 'WS' | 'AR' | 'BO' | 'BR' | 'CL' | 'CO' | 'EC' | 'FK' | 'GF' | 'GY' | 'PE' | 'PY' | 'SR' | 'UY' | 'VE';

declare const _default$5: () => FlagMap;

declare const _default$4: () => Promise<any>;

declare const _default$3: (continentCode: CONTINENT_CODE) => Promise<any>;

declare const _default$2: () => Promise<never[]>;

declare const _default$1: (countryCode: COUNTRY_CODE) => Promise<any>;

declare const _default: (countryCode: COUNTRY_CODE, stateCode: string) => Promise<any>;

export { type CountryCodeType, type CurrencyCodeType, _default$k as convertToMajorUnit, _default$j as convertToMinorUnit, _default$d as formatDate, _default$c as formatDateTime, _default$o as formatNumber, _default$l as formatNumberByParts, _default$h as formatPhoneNumber, _default$b as formatTime, _default$4 as getAllContinents, _default$2 as getAllCountries, _default as getCities, _default$3 as getCountriesByContinent, _default$n as getCurrencyList, _default$m as getCurrencySymbol, _default$e as getDialCodeByCountryCode, _default$f as getDialCodes, _default$6 as getFlagByCountry, _default$5 as getListOfAllFlags, _default$a as getRelativeTime, _default$r as getState, _default$1 as getStatesByCountry, _default$9 as getWeekdays, _default$8 as isValidDate, _default$i as isValidPhoneNumber, _default$7 as parseDateTime, _default$g as parsePhoneNumber, _default$p as resetState, _default$q as setState };
