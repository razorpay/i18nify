declare const ALLOWED_FORMAT_PARTS_KEYS: readonly ["nan", "infinity", "percent", "integer", "group", "decimal", "fraction", "plusSign", "minusSign", "percentSign", "currency", "code", "symbol", "name", "compact", "exponentInteger", "exponentMinusSign", "exponentSeparator", "unit"];

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

declare const _default$5: (amount: string | number, options?: {
    currency?: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY" | undefined;
    locale?: string | undefined;
    intlOptions?: I18nifyNumberFormatOptions | undefined;
} | undefined) => string;

declare const _default$4: () => {
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

declare const _default$3: (currencyCode: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY") => string;

declare const _default$2: (amount: string | number, options?: {
    currency?: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY" | undefined;
    locale?: string | undefined;
    intlOptions?: I18nifyNumberFormatOptions | undefined;
} | undefined) => ByParts;

declare const _default$1: (amount: number, options: {
    currency: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY";
}) => number;

declare const _default: (amount: number, options: {
    currency: "ARS" | "BND" | "DKK" | "GIP" | "HNL" | "LSL" | "MDL" | "MMK" | "NIO" | "NOK" | "PGK" | "SEK" | "AED" | "ALL" | "AMD" | "AUD" | "AWG" | "BBD" | "BDT" | "BMD" | "BOB" | "BSD" | "BWP" | "BZD" | "CAD" | "CHF" | "CNY" | "COP" | "CRC" | "CUP" | "CZK" | "DOP" | "DZD" | "EGP" | "ETB" | "EUR" | "FJD" | "GBP" | "GHS" | "GMD" | "GTQ" | "GYD" | "HKD" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "JMD" | "KES" | "KGS" | "KHR" | "KYD" | "KZT" | "LAK" | "LKR" | "LRD" | "MAD" | "MKD" | "MNT" | "MOP" | "MUR" | "MVR" | "MWK" | "MXN" | "MYR" | "NAD" | "NGN" | "NPR" | "NZD" | "PEN" | "PHP" | "PKR" | "QAR" | "RUB" | "SAR" | "SCR" | "SGD" | "SLL" | "SOS" | "SSP" | "SVC" | "SZL" | "THB" | "TTD" | "TZS" | "USD" | "UYU" | "UZS" | "YER" | "ZAR" | "KWD" | "BHD" | "OMR" | "JPY";
}) => number;

export { type CurrencyCodeType, _default$1 as convertToMajorUnit, _default as convertToMinorUnit, _default$5 as formatNumber, _default$2 as formatNumberByParts, _default$4 as getCurrencyList, _default$3 as getCurrencySymbol };