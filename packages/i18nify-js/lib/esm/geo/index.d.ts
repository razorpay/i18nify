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

export { _default$4 as getAllContinents, _default$2 as getAllCountries, _default as getCitiesByState, _default$3 as getCountriesByContinent, _default$6 as getFlagByCountry, _default$5 as getListOfAllFlags, _default$1 as getStatesByCountry };
