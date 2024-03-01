// extracted from https://www.henleyglobal.com/passport-index

export type CountryCodeType =
  | 'AF' // Afghanistan
  | 'AL' // Albania
  | 'DZ' // Algeria
  | 'AO' // Angola
  | 'AI' // Anguilla
  | 'AG' // Antigua and Barbuda
  | 'AR' // Argentina
  | 'AM' // Armenia
  | 'AW' // Aruba
  | 'AU' // Australia
  | 'AT' // Austria
  | 'AZ' // Azerbaijan
  | 'BS' // Bahamas
  | 'BH' // Bahrain
  | 'BD' // Bangladesh
  | 'BB' // Barbados
  | 'BY' // Belarus
  | 'BE' // Belgium
  | 'BZ' // Belize
  | 'BJ' // Benin
  | 'BM' // Bermuda
  | 'BT' // Bhutan
  | 'BO' // Bolivia
  | 'BQ' // Bonaire, Sint Eustatius and Saba
  | 'BA' // Bosnia and Herzegovina
  | 'BW' // Botswana
  | 'BR' // Brazil
  | 'BN' // Brunei Darussalam
  | 'BG' // Bulgaria
  | 'BF' // Burkina Faso
  | 'BI' // Burundi
  | 'KH' // Cambodia
  | 'CM' // Cameroon
  | 'CA' // Canada
  | 'CV' // Cape Verde
  | 'KY' // Cayman Islands
  | 'CF' // Central African Republic
  | 'TD' // Chad
  | 'CL' // Chile
  | 'CN' // China
  | 'CO' // Colombia
  | 'KM' // Comoros
  | 'CG' // Congo
  | 'CD' // Congo
  | 'CK' // Cook Islands
  | 'CR' // Costa Rica
  | 'CI' // Cote D'Ivoire
  | 'HR' // Croatia
  | 'CU' // Cuba
  | 'CW' // Curaçao
  | 'CY' // Cyprus
  | 'CZ' // Czech Republic
  | 'DK' // Denmark
  | 'DJ' // Djibouti
  | 'DM' // Dominica
  | 'DO' // Dominican Republic
  | 'EC' // Ecuador
  | 'EG' // Egypt
  | 'SV' // El Salvador
  | 'GQ' // Equatorial Guinea
  | 'ER' // Eritrea
  | 'EE' // Estonia
  | 'ET' // Ethiopia
  | 'FK' // Falkland Islands (Malvinas)
  | 'FJ' // Fiji
  | 'FI' // Finland
  | 'FR' // France
  | 'GF' // French Guiana
  | 'PF' // French Polynesia
  | 'FW' // French West Indies
  | 'GA' // Gabon
  | 'GM' // Gambia
  | 'GE' // Georgia
  | 'DE' // Germany
  | 'GH' // Ghana
  | 'GI' // Gibraltar
  | 'GR' // Greece
  | 'GD' // Grenada
  | 'GU' // Guam
  | 'GT' // Guatemala
  | 'GN' // Guinea
  | 'GW' // Guinea-Bissau
  | 'GY' // Guyana
  | 'HT' // Haiti
  | 'HN' // Honduras
  | 'HK' // Hong Kong
  | 'HU' // Hungary
  | 'IS' // Iceland
  | 'IN' // India
  | 'ID' // Indonesia
  | 'IR' // Iran
  | 'IQ' // Iraq
  | 'IE' // Ireland
  | 'IL' // Israel
  | 'IT' // Italy
  | 'JM' // Jamaica
  | 'JP' // Japan
  | 'JO' // Jordan
  | 'KZ' // Kazakhstan
  | 'KE' // Kenya
  | 'KI' // Kiribati
  | 'XK' // Kosovo
  | 'KW' // Kuwait
  | 'KG' // Kyrgyzstan
  | 'LA' // Lao People's Democratic Republic
  | 'LV' // Latvia
  | 'LB' // Lebanon
  | 'LS' // Lesotho
  | 'LR' // Liberia
  | 'LY' // Libya
  | 'LT' // Lithuania
  | 'LU' // Luxembourg
  | 'MO' // Macao
  | 'MK' // Macedonia
  | 'MG' // Madagascar
  | 'MW' // Malawi
  | 'MY' // Malaysia
  | 'MV' // Maldives
  | 'ML' // Mali
  | 'MT' // Malta
  | 'MH' // Marshall Islands
  | 'MR' // Mauritania
  | 'MU' // Mauritius
  | 'YT' // Mayotte
  | 'MX' // Mexico
  | 'FM' // Micronesia
  | 'MD' // Moldova
  | 'MN' // Mongolia
  | 'ME' // Montenegro
  | 'MS' // Montserrat
  | 'MA' // Morocco
  | 'MZ' // Mozambique
  | 'MM' // Myanmar
  | 'NA' // Namibia
  | 'NR' // Nauru
  | 'NP' // Nepal
  | 'NL' // Netherlands
  | 'NC' // New Caledonia
  | 'NZ' // New Zealand
  | 'NI' // Nicaragua
  | 'NE' // Niger
  | 'NG' // Nigeria
  | 'KP' // North Korea
  | 'NU' // Niue
  | 'MP' // Northern Mariana Islands
  | 'NO' // Norway
  | 'OM' // Oman
  | 'PK' // Pakistan
  | 'PW' // Palau
  | 'PA' // Panama
  | 'PG' // Papua New Guinea
  | 'PY' // Paraguay
  | 'PE' // Peru
  | 'PH' // Philippines
  | 'PL' // Poland
  | 'PT' // Portugal
  | 'PR' // Puerto Rico
  | 'QA' // Qatar
  | 'RE' // Réunion
  | 'RO' // Romania
  | 'RU' // Russian Federation
  | 'RW' // Rwanda
  | 'WS' // Samoa
  | 'AS' // American Samoa
  | 'ST' // Sao Tome and Principe
  | 'SA' // Saudi Arabia
  | 'SN' // Senegal
  | 'RS' // Serbia
  | 'SC' // Seychelles
  | 'SL' // Sierra Leone
  | 'SG' // Singapore
  | 'SK' // Slovakia
  | 'SI' // Slovenia
  | 'SB' // Solomon Islands
  | 'SO' // Somalia
  | 'ZA' // South Africa
  | 'KR' // South Korea
  | 'SS' // South Sudan
  | 'ES' // Spain
  | 'LK' // Sri Lanka
  | 'SH' // Saint Helena
  | 'KN' // Saint Kitts and Nevis
  | 'LC' // Saint Lucia
  | 'MF' // Saint Martin (French part)
  | 'VC' // Saint Vincent and the Grenadines
  | 'SD' // Sudan
  | 'SR' // Suriname
  | 'SZ' // Eswatini
  | 'SE' // Sweden
  | 'CH' // Switzerland
  | 'SY' // Syrian Arab Republic
  | 'TW' // Taiwan, Province of China
  | 'TJ' // Tajikistan
  | 'TZ' // Tanzania
  | 'TH' // Thailand
  | 'TL' // Timor-Leste
  | 'TG' // Togo
  | 'TO' // Tonga
  | 'TT' // Trinidad and Tobago
  | 'TN' // Tunisia
  | 'TR' // Turkey
  | 'TM' // Turkmenistan
  | 'TC' // Turks and Caicos Islands
  | 'TV' // Tuvalu
  | 'UG' // Uganda
  | 'UA' // Ukraine
  | 'AE' // United Arab Emirates
  | 'GB' // United Kingdom
  | 'US' // United States
  | 'UY' // Uruguay
  | 'UZ' // Uzbekistan
  | 'VU' // Vanuatu
  | 'VE' // Venezuela
  | 'VN' // Vietnam
  | 'VG' // Virgin Islands, British
  | 'VI' // Virgin Islands, U.S.
  | 'YE' // Yemen
  | 'ZM' // Zambia
  | 'ZW' // Zimbabwe
  | 'LI' // Liechtenstein
  | 'MC' // Monaco
  | 'SM' // San Marino
  | 'VA' // Holy See (Vatican City State)
  | 'AD' // Andorra
  | 'PS' // Palestine
  | 'FO' // Faroe Islands
  | 'GL'; // Greenland;
