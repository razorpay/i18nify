// extracted from https://www.henleyglobal.com/passport-index. Passport index uses https://api.henleypassportindex.com/api/v3/countries endpoint which brings the list of recognized countries and related data. This is has been picked up from there.

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

export interface GetFlagReturnType {
  original: string;
  '4X3': string;
}

export type CountryCodeTypeForAllFlags =
  | 'AD' // Andorra
  | 'AE' // United Arab Emirates
  | 'AF' // Afghanistan
  | 'AG' // Antigua and Barbuda
  | 'AI' // Anguilla
  | 'AL' // Albania
  | 'AM' // Armenia
  | 'AO' // Angola
  | 'AQ' // Antarctica
  | 'AR' // Argentina
  | 'AS' // American Samoa
  | 'AT' // Austria
  | 'AU' // Australia
  | 'AW' // Aruba
  | 'AX' // Åland Islands
  | 'AZ' // Azerbaijan
  | 'BA' // Bosnia and Herzegovina
  | 'BB' // Barbados
  | 'BD' // Bangladesh
  | 'BE' // Belgium
  | 'BF' // Burkina Faso
  | 'BG' // Bulgaria
  | 'BH' // Bahrain
  | 'BI' // Burundi
  | 'BJ' // Benin
  | 'BL' // Saint Barthélemy
  | 'BM' // Bermuda
  | 'BN' // Brunei Darussalam
  | 'BO' // Bolivia
  | 'BQ-BO' // Bonaire
  | 'BQ-SA' // Saba
  | 'BQ-SE' // Sint Eustatius
  | 'BQ' // Caribbean Netherlands
  | 'BR' // Brazil
  | 'BS' // Bahamas
  | 'BT' // Bhutan
  | 'BV' // Bouvet Island
  | 'BW' // Botswana
  | 'BY' // Belarus
  | 'BZ' // Belize
  | 'CA' // Canada
  | 'CC' // Cocos (Keeling) Islands
  | 'CD' // Congo, Democratic Republic of the
  | 'CF' // Central African Republic
  | 'CG' // Congo
  | 'CH' // Switzerland
  | 'CI' // Côte d'Ivoire
  | 'CK' // Cook Islands
  | 'CL' // Chile
  | 'CM' // Cameroon
  | 'CN' // China
  | 'CO' // Colombia
  | 'CR' // Costa Rica
  | 'CU' // Cuba
  | 'CV' // Cabo Verde
  | 'CW' // Curaçao
  | 'CX' // Christmas Island
  | 'CY' // Cyprus
  | 'CZ' // Czech Republic
  | 'DE' // Germany
  | 'DJ' // Djibouti
  | 'DK' // Denmark
  | 'DM' // Dominica
  | 'DO' // Dominican Republic
  | 'DZ' // Algeria
  | 'EC' // Ecuador
  | 'EE' // Estonia
  | 'EG' // Egypt
  | 'EH' // Western Sahara
  | 'ER' // Eritrea
  | 'ES' // Spain
  | 'ET' // Ethiopia
  | 'FI' // Finland
  | 'FJ' // Fiji
  | 'FK' // Falkland Islands (Malvinas)
  | 'FM' // Micronesia (Federated States of)
  | 'FO' // Faroe Islands
  | 'FR' // France
  | 'GA' // Gabon
  | 'GB-ENG' // England
  | 'GB-NIR' // Northern Ireland
  | 'GB-SCT' // Scotland
  | 'GB-UKM' // United Kingdom
  | 'GB-WLS' // Wales
  | 'GB' // United Kingdom
  | 'GD' // Grenada
  | 'GE' // Georgia
  | 'GF' // French Guiana
  | 'GG' // Guernsey
  | 'GH' // Ghana
  | 'GI' // Gibraltar
  | 'GL' // Greenland
  | 'GM' // Gambia
  | 'GN' // Guinea
  | 'GP' // Guadeloupe
  | 'GQ' // Equatorial Guinea
  | 'GR' // Greece
  | 'GS' // South Georgia and the South Sandwich Islands
  | 'GT' // Guatemala
  | 'GU' // Guam
  | 'GW' // Guinea-Bissau
  | 'GY' // Guyana
  | 'HK' // Hong Kong
  | 'HM' // Heard Island and McDonald Islands
  | 'HN' // Honduras
  | 'HR' // Croatia
  | 'HT' // Haiti
  | 'HU' // Hungary
  | 'ID' // Indonesia
  | 'IE' // Ireland
  | 'IL' // Israel
  | 'IM' // Isle of Man
  | 'IN' // India
  | 'IO' // British Indian Ocean Territory
  | 'IQ' // Iraq
  | 'IR' // Iran (Islamic Republic of)
  | 'IS' // Iceland
  | 'IT' // Italy
  | 'JE' // Jersey
  | 'JM' // Jamaica
  | 'JO' // Jordan
  | 'JP' // Japan
  | 'KE' // Kenya
  | 'KG' // Kyrgyzstan
  | 'KH' // Cambodia
  | 'KI' // Kiribati
  | 'KM' // Comoros
  | 'KN' // Saint Kitts and Nevis
  | 'KP' // Korea (Democratic People's Republic of)
  | 'KR' // Korea (Republic of)
  | 'KW' // Kuwait
  | 'KY' // Cayman Islands
  | 'KZ' // Kazakhstan
  | 'LA' // Lao People's Democratic Republic
  | 'LB' // Lebanon
  | 'LC' // Saint Lucia
  | 'LI' // Liechtenstein
  | 'LK' // Sri Lanka
  | 'LR' // Liberia
  | 'LS' // Lesotho
  | 'LT' // Lithuania
  | 'LU' // Luxembourg
  | 'LV' // Latvia
  | 'LY' // Libya
  | 'MA' // Morocco
  | 'MC' // Monaco
  | 'MD' // Moldova (Republic of)
  | 'ME' // Montenegro
  | 'MF' // Saint Martin (French part)
  | 'MG' // Madagascar
  | 'MH' // Marshall Islands
  | 'MK' // North Macedonia
  | 'ML' // Mali
  | 'MM' // Myanmar
  | 'MN' // Mongolia
  | 'MO' // Macao
  | 'MP' // Northern Mariana Islands
  | 'MQ' // Martinique
  | 'MR' // Mauritania
  | 'MS' // Montserrat
  | 'MT' // Malta
  | 'MU' // Mauritius
  | 'MV' // Maldives
  | 'MW' // Malawi
  | 'MX' // Mexico
  | 'MY' // Malaysia
  | 'MZ' // Mozambique
  | 'NA' // Namibia
  | 'NC' // New Caledonia
  | 'NE' // Niger
  | 'NF' // Norfolk Island
  | 'NG' // Nigeria
  | 'NI' // Nicaragua
  | 'NL' // Netherlands
  | 'NO' // Norway
  | 'NP' // Nepal
  | 'NR' // Nauru
  | 'NU' // Niue
  | 'NZ' // New Zealand
  | 'OM' // Oman
  | 'PA' // Panama
  | 'PE' // Peru
  | 'PF' // French Polynesia
  | 'PG' // Papua New Guinea
  | 'PH' // Philippines
  | 'PK' // Pakistan
  | 'PL' // Poland
  | 'PM' // Saint Pierre and Miquelon
  | 'PN' // Pitcairn
  | 'PR' // Puerto Rico
  | 'PS' // Palestine, State of
  | 'PT' // Portugal
  | 'PW' // Palau
  | 'PY' // Paraguay
  | 'QA' // Qatar
  | 'RE' // Réunion
  | 'RO' // Romania
  | 'RS' // Serbia
  | 'RU' // Russian Federation
  | 'RW' // Rwanda
  | 'SA' // Saudi Arabia
  | 'SB' // Solomon Islands
  | 'SC' // Seychelles
  | 'SD' // Sudan
  | 'SE' // Sweden
  | 'SG' // Singapore
  | 'SH' // Saint Helena, Ascension and Tristan da Cunha
  | 'SI' // Slovenia
  | 'SJ' // Svalbard and Jan Mayen
  | 'SK' // Slovakia
  | 'SL' // Sierra Leone
  | 'SM' // San Marino
  | 'SN' // Senegal
  | 'SO' // Somalia
  | 'SR' // Suriname
  | 'SS' // South Sudan
  | 'ST' // Sao Tome and Principe
  | 'SV' // El Salvador
  | 'SX' // Sint Maarten (Dutch part)
  | 'SY' // Syrian Arab Republic
  | 'SZ' // Eswatini
  | 'TC' // Turks and Caicos Islands
  | 'TD' // Chad
  | 'TF' // French Southern Territories
  | 'TG' // Togo
  | 'TH' // Thailand
  | 'TJ' // Tajikistan
  | 'TK' // Tokelau
  | 'TL' // Timor-Leste
  | 'TM' // Turkmenistan
  | 'TN' // Tunisia
  | 'TO' // Tonga
  | 'TR' // Turkey
  | 'TT' // Trinidad and Tobago
  | 'TV' // Tuvalu
  | 'TW' // Taiwan, Province of China
  | 'TZ' // Tanzania, United Republic of
  | 'UA' // Ukraine
  | 'UG' // Uganda
  | 'UM' // United States Minor Outlying Islands
  | 'US' // United States of America
  | 'UY' // Uruguay
  | 'UZ' // Uzbekistan
  | 'VA' // Holy See
  | 'VC' // Saint Vincent and the Grenadines
  | 'VE' // Venezuela (Bolivarian Republic of)
  | 'VG' // Virgin Islands (British)
  | 'VI' // Virgin Islands (U.S.)
  | 'VN' // Viet Nam
  | 'VU' // Vanuatu
  | 'WF' // Wallis and Futuna
  | 'WS' // Samoa
  | 'YE' // Yemen
  | 'YT-UNF' // Mayotte (UNF)
  | 'YT' // Mayotte
  | 'ZA' // South Africa
  | 'ZM' // Zambia
  | 'ZW'; // Zimbabwe
