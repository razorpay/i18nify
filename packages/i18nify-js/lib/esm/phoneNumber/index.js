import { w as withErrorBoundary } from '../index-0rEDS6JS.js';

const PHONE_REGEX_MAPPER = {
    IN: /^(?:(?:\+|0{0,2})91\s*[-]?\s*|[0]?)?[6789]\d{9}$/,
    MY: /^(\+?6?0)?(\d{1,3})[-. ]?(\d{7,8})$/,
    AE: /^(?:\+?971|0)?(?:2|3|4|6|7|9)\d{8}$/,
    AL: /^(?:\+?355)?(?:[4-9]\d{7}|6\d{8})$/,
    AM: /^(?:\+?374)?(?:[0-9]{8}|[0-9]{6}[0-9]{2})$/,
    AR: /^(?:(?:\+|0{0,2})54)?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/,
    AU: /^(?:\+?61|0)4\d{8}$/,
    AW: /^(?:(?:\+297)?(?!0)\d{7})$/,
    BB: /^(?:(?:\+1)?246)?(?:\d{3})?\d{7}$/,
    BD: /^(?:\+?880|0)1[13456789]\d{8}$/,
    BM: /^(?:(?:\+1)?441)?(?:\d{2})?\d{7}$/,
    BN: /^(?:\+?673)?(?:\d{3})?\d{4}$/,
    BO: /^(?:(?:\+|0{0,2})591)?(?:(?:2|3|7|6)\d{7})$/,
    BS: /^(?:(?:\+1)?242)?(?:\d{3})?\d{7}$/,
    BW: /^(?:(?:\+267)?\s?)?[74]\d{7}$/,
    BZ: /^(?:(?:\+501)?\s?)?[622]\d{4}$/,
    CH: /^(?:(?:\+41|0)(?:\s*\(?0\)?\s*))?(?:\d{2}\s*)?\d{3}\s*\d{2}\s*\d{2}$/,
    CN: /^(?:(?:\+|00)86)?1\d{10}$/,
    CO: /^(?:(?:\+57|0057)?)?[1-8]{1}\d{6,7}$/,
    OM: /^(?:\+?968)?(?:95|96|97|98)\d{6}$/,
    CR: /^(?:(?:\+506)?\s*|0)?[1-9]\d{7}$/,
    CU: /^(?:\+?53)?(?:[5-8]\d{7})$/,
    CZ: /^(?:\+?420)?(?:\d{9})$/,
    DK: /^(?:\+?45)?(?:\d{8})$/,
    DO: /^(?:(?:\+1)?809|1-8(?:00|88|89))(?:\d{7})$/,
    DZ: /^(?:\+?213|0)([567]\d{8})$/,
    EG: /^(?:(?:\+20|20)?(\d{10}))$/,
    ET: /^(?:\+?251)?[1-59]\d{8}$/,
    EU: /^(?:(?:\+?3)?8)?\s*(?:\d{3}\s*){3}\d{2}$/,
    FJ: /^(?:(?:\+?679)?\s?\d{3}\s?\d{4})?$/,
    GB: /^(?:(?:\+44\s?|0)7\d{3}(\s?\d{4,})?)$/,
    GH: /^(?:(?:\+233)|0)?(?:\d{9})$/,
    GI: /^(?:\+350)?\d{5}$/,
    GM: /^(?:\+220)?\d{5,7}$/,
    GT: /^(?:\+502)?[2468]\d{7,8}$/,
    GY: /^(?:(?:\+592)?(?:(?:\s)?[2-9])(?:(?:\s)?\d))?(?:(?:\s)?\d{4})$/,
    HK: /^(?:\+852\s?)?[456789]\d{3}\s?\d{4}$/,
    HN: /^(?:\+504)?[89]\d{7}$/,
    HR: /^(?:\+?385)?\d{8,9}$/,
    HT: /^(?:\+?509)?\d{8}$/,
    HU: /^(?:(?:\+36))(\s?\d{2}\s?\d{3}\s?\d{4})$/,
    ID: /^(?:\+?62|0[1-9])[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}$/,
    IL: /^(?:(?:\+972|0)(?:-)?)[23489]\d{7}$/,
    JM: /^(?:(?:\+1876))\d{7,10}$/,
    KE: /^(?:(?:\+254)|(?:0))(?:\d{6,7})$/,
    KG: /^(?:\+996)?\s?\d{9}$/,
    KH: /^(?:(?:\+855)|(?:0))(?:\s?[1-9]\d{7,8})$/,
    KY: /^(?:\+?1\s?(345))\d{6}$/,
    KZ: /^(?:\+?7|8)?7\d{9}$/,
    LA: /^(?:(?:\+?856)|0)(20\d{7,9})$/,
    LK: /^(?:(?:\+94)|0)(?:\d{9})$/,
    LR: /^(?:\+231)[ -\d]{4}[ -\d]{4}$/,
    LS: /^(?:(?:\+?266)|0)?[56]\d{7}$/,
    MA: /^(?:(?:\+?212(\s*[-|\s*]?\d{1,9})?)|(?:0))(?:\d{9})$/,
    MD: /^(?:(?:\+373)|(?:0))(?:\d{7,8})$/,
    MK: /^(?:\+389|0)(?:(?:2[0-4]|[3-9])\s?)?\d{6}$/,
    MM: /^(?:(?:\+?95)|0)?[1-9]\d{9}$/,
    MN: /^(?:\+976|0)\d{8}$/,
    MO: /^(?:(?:\+?853)|[0-9])?\d{8}$/,
    MU: /^(?:\+230|0)?\d{8}$/,
    MV: /^(?:(?:\+?960)|0)?\d{7}$/,
    MW: /^(?:\+265)[1-9]\d{6}$/,
    MX: /^(?:(?:\+?52)?\s?(?:1|01)?\s?)?(?:\d{3}\s?\d{3}\s?\d{4})$/,
    NA: /^(?:(?:\+264)|0)?\d{8}$/,
    NG: /^(?:(?:\+234)|(?:0))(?:\d{7,8})$/,
    NI: /^(?:(?:\+505))?(?:\d{8})$/,
    NO: /^(?:(?:\+?47)|\d{2}|\d{3})\s?\d{2}\s?\d{3}$/,
    NP: /^(?:(?:\+977))?(\d{9,10})$/,
    NZ: /^(?:\+?64|0)(\d{2,5} \d{4,8}|\d{3,4} \d{4})$/,
    PE: /^(?:(?:\+51)|0)?(?:9\d{8})$/,
    PG: /^(?:\+?675)?(?:[7-9]\d{7})$/,
    PH: /^(?:(?:\+?63)|0)(?:\d{10})$/,
    PK: /^(?:(?:\+92)|0)?[345]\d{9}$/,
    QA: /^(?:\+?974)?-?33\d{5}$/,
    RU: /^(?:\+?7|8)?[ -]?\(?9\d{2}\)?[ -]?\d{3}[ -]?\d{2}[ -]?\d{2}$/,
    SA: /^(?:\+?966)?\s?1?[\s-]?(?:[45]\d{2}|5\d{3})[\s-]?\d{4}$/,
    SC: /^(?:(?:\+248)|\d{4})\d{5}$/,
    SE: /^(?:\+?46|0)\s?[1-57-9](?:[0-9]\s?){8}$/,
    SG: /^(?:(?:\+65)|(?:\(\+65\))|(?:65))\d{4}\d{4}$/,
    SL: /^(?:(?:\+232)|(?:0))?\d{9}$/,
    SO: /^(?:\+252|0)?[567]\d{7}$/,
    SS: /^(?:\+211|0)?[1-9]\d{7,9}$/,
    SV: /^(?:(?:\+?503)|(?:0))(?:\d{8})$/,
    SZ: /^(?:\+?268)?\d{7,8}$/,
    TH: /^(?:(?:\+66)|0)\d{9}$/,
    TT: /^(?:(?:\+?1-868)|\(?868\)?)(\d{7})$/,
    TZ: /^(?:(?:\+?255)|0)?[67]\d{8}$/,
    US: /^(\+\d{1,2}\s?)?([2-9]{1}\d{2}[2-9]{1}\d{6})$/,
    CA: /^(\+\d{1,2}\s?)?([2-9]{1}\d{2}[2-9]{1}\d{6})$/,
    UY: /^(?:(?:\+598|0)\s?(9\d{3}|2\d{2}|[4-9]\d{6}))$/,
    UZ: /^(?:\+?998)?\s?[3456789]\d{8}$/,
    YE: /^(?:\+?967)?(?:\d{7,8})$/,
    ZA: /^(?:(?:\+27)|0)(\d{9})$/,
    KW: /^(?:\+?965)[569]\d{7}$/,
    BH: /^(?:\+?973)?[356]\d{7}$/,
    TL: /^(?:(?:\+670)\s?)?[0-9]{3}\s?[0-9]{3,4}$/,
    VC: /^(?:(?:\+1)?784)?(?:\d{3})?\d{7}$/,
    VE: /^(?:(?:\+58)|0)?4\d{9}$/,
    VN: /^(?:(?:\+84)|0)?[1-9]\d{8}$/,
    ZM: /^(?:(?:\+260)|0)?[123456789]\d{8,9}$/,
    ZW: /^(?:(?:\+263)|0)?(?:\d{9,10})$/,
    LT: /^(?:(?:\+370)|8)\d{8}$/,
    LU: /^(?:(?:\+352)?(6|2(6|7|8|9))\d{6})$/,
    LV: /^(?:(?:\+371)?2\d{7})$/,
    ME: /^(?:(?:\+382)?[67]\d{7,20})$/,
    MG: /^(?:(?:\+261)?3[234568]\d{7})$/,
    MZ: /^(?:(?:\+258)|(?:258))?8[234567]\d{7,8}$/,
    NL: /^(?:(?:\+31)|0(6(?:\d{8})|[1-9](?:(?:\d{8})|(?:\s\d{3}\s\d{4}))|(?:\d{8})))$/,
    PA: /^(?:(?:\+507)\s?)?[46]\d{6,7}$/,
    PL: /^(?:(?:\+48)?(?:\s?\d{3}\s?\d{3}\s?\d{3}|(?:\d{2}\s?){4}\d{2}|\d{3}-\d{3}-\d{3}))$/,
    PR: /^(?:(?:\+1)?787|939)\d{7}$/,
    PS: /^(?:(?:\+970))(5[2349])\d{7}$/,
    PT: /^(?:(?:\+351)?9(1\d|2[1-9]|6[12345789]|7[12345789])\d{7})$/,
    PY: /^(?:(?:\+595|0)9[9876]\d{7})$/,
    RO: /^(?:(?:\+40|0))(?:7[2-8]\d{7}|21\d{8})$/,
    RS: /^(?:(?:\+381)|0)([0-6]|[7][012345])[0-9]{5,10}$/,
    RW: /^(?:(?:\+250)|(0))\d{9}$/,
    SI: /^(?:(?:\+386)|0)?[1-59]\d{7,8}$/,
    SK: /^(?:(?:\+421))?(0|9[0-8])\d{8}$/,
    SM: /^(?:(?:\+378)|(0549|6\d{4}))\d{5}$/,
    SN: /^(?:(?:\+221)|0)?[3679]\d{7}$/,
    SR: /^(?:(?:\+597))\d{7}$/,
    TG: /^(?:(?:\+228))\d{8}$/,
    TJ: /^(?:(?:\+992))(37|55|77)\d{7}$/,
    TN: /^(?:(?:\+216)|22|9[1-9])\d{7}$/,
    TR: /^(?:(?:\+90)|(0))\s?5\d{9}$/,
    TW: /^(?:(?:\+886)|0)?9\d{8}$/,
    UA: /^(?:(?:\+380)|(0))?(39|50|63|66|67|68|91|92|93|94|95|96|97|98|99)\d{7}$/,
    UG: /^(?:(?:\+256)|0)?[39]\d{8}$/,
    AG: /^(?:\+1-268)?(?:\d{7})$/,
    AI: /^(?:\+1-264)?(?:\d{7})$/,
    AO: /^(?:\+244)?(?:\d{9})$/,
    AQ: /^(?:\+672)?(?:\d{6})$/,
    AS: /^(?:\+1-684)?(?:\d{7})$/,
    AT: /^(?:\+43)?(?:\d{4,13})$/,
    AZ: /^(?:\+994)?(?:\d{9})$/,
    BA: /^(?:\+387)?(?:\d{6,8})$/,
    BE: /^(?:\+32)?(?:\d{8,9})$/,
    BF: /^(?:\+226)?(?:\d{8})$/,
    BG: /^(?:\+359)?(?:\d{7,9})$/,
    BI: /^(?:\+257)?(?:\d{8})$/,
    BJ: /^(?:\+229)?(?:\d{8})$/,
    BL: /^(?:\+590)?(?:\d{9})$/,
    BQ: /^(?:\+599)?(?:\d{7})$/,
    BR: /^(?:\+55)?(?:\d{10,11})$/,
    BT: /^(?:\+975)?(?:\d{8})$/,
    BY: /^(?:\+375)?(?:\d{9})$/,
    CC: /^(?:\+61)?(?:\d{8,9})$/,
    CD: /^(?:\+243)?(?:\d{9})$/,
    CF: /^(?:\+236)?(?:\d{8})$/,
    CG: /^(?:\+242)?(?:\d{9})$/,
    CI: /^(?:\+225)?(?:\d{8})$/,
    CK: /^(?:\+682)?(?:\d{5})$/,
    CL: /^(?:\+56)?(?:\d{9})$/,
    CM: /^(?:\+237)?(?:\d{9})$/,
    CV: /^(?:\+238)?(?:\d{7})$/,
    CW: /^(?:\+599)?(?:\d{7})$/,
    CX: /^(?:\+61)?(?:\d{8,9})$/,
    CY: /^(?:\+357)?(?:\d{8})$/,
    DE: /^(?:\+49)?(?:\d{6,11})$/,
    DJ: /^(?:\+253)?(?:\d{6})$/,
    DM: /^(?:\+1-767)?(?:\d{7})$/,
    EC: /^(?:\+593)?(?:\d{8,9})$/,
    EE: /^(?:\+372)?(?:\d{7,8})$/,
    EH: /^(?:\+212)?(?:\d{9})$/,
    ER: /^(?:\+291)?(?:\d{6,7})$/,
    ES: /^(?:\+34)?(?:\d{9})$/,
    FI: /^(?:\+358)?(?:\d{5,12})$/,
    FK: /^(?:\+500)?(?:\d{5})$/,
    FM: /^(?:\+691)?(?:\d{7})$/,
    FO: /^(?:\+298)?(?:\d{6})$/,
    FR: /^(?:\+33)?(?:\d{9})$/,
    GA: /^(?:\+241)?(?:\d{6,7})$/,
    GD: /^(?:\+1-473)?(?:\d{7})$/,
    GE: /^(?:\+995)?(?:\d{8,9})$/,
    GU: /^(?:\+1-671)?\d{7}$/,
    KN: /^(?:\+1-869)?\d{7}$/,
    LC: /^(?:\+1-758)?\d{7}$/,
    MP: /^(?:\+1-670)?\d{7}$/,
    MS: /^(?:\+1-664)?\d{7}$/,
    SX: /^(?:\+1-721)?\d{7}$/,
    TC: /^(?:\+1-649)?\d{7}$/,
    VG: /^(?:\+1-284)?\d{7}$/,
    VI: /^(?:\+1-340)?\d{7}$/,
    GR: /^(?:\+30)?\d{10}$/,
    IT: /^(?:\+39)?\d{9,10}$/,
    VA: /^(?:\+379)?\d{8,12}$/,
    GG: /^(?:\+44-1481)?\d{6}$/,
    IM: /^(?:\+44-1624)?\d{6}$/,
    JE: /^(?:\+44-1534)?\d{6}$/,
    SJ: /^\\+47\\d{8}$/,
    JP: /^(?:\+81)?\d{10}$/,
    KR: /^(?:\+82)?\d{8,11}$/,
    AF: /^(?:\+93)?\d{9}$/,
    IR: /^(?:\+98)?\d{10}$/,
    LY: /^(?:\+218)?\d{9}$/,
    MR: /^(?:\+222)?\d{8}$/,
    ML: /^(?:\+223)?\d{8}$/,
    GN: /^(?:\+224)?\d{8}$/,
    NE: /^(?:\+227)?\d{8}$/,
    TD: /^(?:\+235)?\d{8}$/,
    ST: /^(?:\+239)?\d{7}$/,
    GQ: /^(?:\+240)?\d{9}$/,
    GW: /^(?:\+245)?\d{7}$/,
    IO: /^\\+246\\d{7}$/,
    AC: /^\\+247\\d{4}$/,
    SD: /^(?:\+249)?\d{9}$/,
    RE: /^(?:\+262)?\d{9}$/,
    YT: /^(?:\+262)?\d{9}$/,
    KM: /^(?:\+269)?\d{7}$/,
    SH: /^\\+290\\d{4,5}$/,
    TA: /^\\+290\\d{4}$/,
    GL: /^(?:\+299)?\d{6}$/,
    IE: /^(?:\+353)?\d{7,10}$/,
    IS: /^(?:\+354)?\d{7}$/,
    MT: /^(?:\+356)?\d{8}$/,
    AX: /^\\+358\\d{5,8}$/,
    AD: /^(?:\+376)?\d{6}$/,
    MC: /^(?:\+377)?\d{8,9}$/,
    XK: /^\\+383\\d{8}$/,
    LI: /^(?:\+423)?\d{7}$/,
    PM: /^(?:\+508)?\d{6}$/,
    GP: /^(?:\+590)?\d{9}$/,
    MF: /^(?:\+590)?\d{9}$/,
    GF: /^(?:\+594)?\d{9}$/,
    MQ: /^(?:\+596)?\d{9}$/,
    NF: /^(?:\+672)?\d{6}$/,
    NR: /^(?:\+674)?\d{7}$/,
    TO: /^(?:\+676)?\d{5}$/,
    SB: /^(?:\+677)?\d{5}$/,
    VU: /^(?:\+678)?\d{7}$/,
    PW: /^(?:\+680)?\d{7}$/,
    WF: /^(?:\+681)?\d{6}$/,
    NU: /^(?:\+683)?\d{4}$/,
    WS: /^(?:\+685)?\d{5}$/,
    KI: /^(?:\+686)?\d{5}$/,
    NC: /^(?:\+687)?\d{6}$/,
    TV: /^(?:\+688)?\d{5}$/,
    PF: /^(?:\+689)?\d{6}$/,
    TK: /^\\+690\\d{4}$/,
    MH: /^(?:\+692)?\d{7}$/,
    KP: /^\\+850\\d{6,9}$/,
    LB: /^(?:\+961)?\d{8}$/,
    JO: /^(?:\+962)?\d{9}$/,
    SY: /^(?:\+963)?\d{9}$/,
    IQ: /^(?:\+964)?\d{10}$/,
    TM: /^(?:\+993)?\d{8}$/,
};

/*  Source: Google LibPhoneNumber Metadata: https://github.com/google/libphonenumber/blob/master/javascript/i18n/phonenumbers/metadata.js  */
const DIAL_CODE_MAPPER = {
    1: [
        'US',
        'AG',
        'AI',
        'AS',
        'BB',
        'BM',
        'BS',
        'CA',
        'DM',
        'DO',
        'GD',
        'GU',
        'JM',
        'KN',
        'KY',
        'LC',
        'MP',
        'MS',
        'PR',
        'SX',
        'TC',
        'TT',
        'VC',
        'VG',
        'VI',
    ],
    7: ['RU', 'KZ'],
    20: ['EG'],
    27: ['ZA'],
    30: ['GR'],
    31: ['NL'],
    32: ['BE'],
    33: ['FR'],
    34: ['ES'],
    36: ['HU'],
    39: ['IT', 'VA'],
    40: ['RO'],
    41: ['CH'],
    43: ['AT'],
    44: ['GB', 'GG', 'IM', 'JE'],
    45: ['DK'],
    46: ['SE'],
    47: ['NO', 'SJ'],
    48: ['PL'],
    49: ['DE'],
    51: ['PE'],
    52: ['MX'],
    53: ['CU'],
    54: ['AR'],
    55: ['BR'],
    56: ['CL'],
    57: ['CO'],
    58: ['VE'],
    60: ['MY'],
    61: ['AU', 'CC', 'CX'],
    62: ['ID'],
    63: ['PH'],
    64: ['NZ'],
    65: ['SG'],
    66: ['TH'],
    81: ['JP'],
    82: ['KR'],
    84: ['VN'],
    86: ['CN'],
    90: ['TR'],
    91: ['IN'],
    92: ['PK'],
    93: ['AF'],
    94: ['LK'],
    95: ['MM'],
    98: ['IR'],
    211: ['SS'],
    212: ['MA', 'EH'],
    213: ['DZ'],
    216: ['TN'],
    218: ['LY'],
    220: ['GM'],
    221: ['SN'],
    222: ['MR'],
    223: ['ML'],
    224: ['GN'],
    225: ['CI'],
    226: ['BF'],
    227: ['NE'],
    228: ['TG'],
    229: ['BJ'],
    230: ['MU'],
    231: ['LR'],
    232: ['SL'],
    233: ['GH'],
    234: ['NG'],
    235: ['TD'],
    236: ['CF'],
    237: ['CM'],
    238: ['CV'],
    239: ['ST'],
    240: ['GQ'],
    241: ['GA'],
    242: ['CG'],
    243: ['CD'],
    244: ['AO'],
    245: ['GW'],
    246: ['IO'],
    247: ['AC'],
    248: ['SC'],
    249: ['SD'],
    250: ['RW'],
    251: ['ET'],
    252: ['SO'],
    253: ['DJ'],
    254: ['KE'],
    255: ['TZ'],
    256: ['UG'],
    257: ['BI'],
    258: ['MZ'],
    260: ['ZM'],
    261: ['MG'],
    262: ['RE', 'YT'],
    263: ['ZW'],
    264: ['NA'],
    265: ['MW'],
    266: ['LS'],
    267: ['BW'],
    268: ['SZ'],
    269: ['KM'],
    290: ['SH', 'TA'],
    291: ['ER'],
    297: ['AW'],
    298: ['FO'],
    299: ['GL'],
    350: ['GI'],
    351: ['PT'],
    352: ['LU'],
    353: ['IE'],
    354: ['IS'],
    355: ['AL'],
    356: ['MT'],
    357: ['CY'],
    358: ['FI', 'AX'],
    359: ['BG'],
    370: ['LT'],
    371: ['LV'],
    372: ['EE'],
    373: ['MD'],
    374: ['AM'],
    375: ['BY'],
    376: ['AD'],
    377: ['MC'],
    378: ['SM'],
    380: ['UA'],
    381: ['RS'],
    382: ['ME'],
    383: ['XK'],
    385: ['HR'],
    386: ['SI'],
    387: ['BA'],
    389: ['MK'],
    420: ['CZ'],
    421: ['SK'],
    423: ['LI'],
    500: ['FK'],
    501: ['BZ'],
    502: ['GT'],
    503: ['SV'],
    504: ['HN'],
    505: ['NI'],
    506: ['CR'],
    507: ['PA'],
    508: ['PM'],
    509: ['HT'],
    590: ['GP', 'BL', 'MF'],
    591: ['BO'],
    592: ['GY'],
    593: ['EC'],
    594: ['GF'],
    595: ['PY'],
    596: ['MQ'],
    597: ['SR'],
    598: ['UY'],
    599: ['CW', 'BQ'],
    670: ['TL'],
    672: ['NF'],
    673: ['BN'],
    674: ['NR'],
    675: ['PG'],
    676: ['TO'],
    677: ['SB'],
    678: ['VU'],
    679: ['FJ'],
    680: ['PW'],
    681: ['WF'],
    682: ['CK'],
    683: ['NU'],
    685: ['WS'],
    686: ['KI'],
    687: ['NC'],
    688: ['TV'],
    689: ['PF'],
    690: ['TK'],
    691: ['FM'],
    692: ['MH'],
    850: ['KP'],
    852: ['HK'],
    853: ['MO'],
    855: ['KH'],
    856: ['LA'],
    880: ['BD'],
    886: ['TW'],
    960: ['MV'],
    961: ['LB'],
    962: ['JO'],
    963: ['SY'],
    964: ['IQ'],
    965: ['KW'],
    966: ['SA'],
    967: ['YE'],
    968: ['OM'],
    970: ['PS'],
    971: ['AE'],
    972: ['IL'],
    973: ['BH'],
    974: ['QA'],
    975: ['BT'],
    976: ['MN'],
    977: ['NP'],
    992: ['TJ'],
    993: ['TM'],
    994: ['AZ'],
    995: ['GE'],
    996: ['KG'],
    998: ['UZ'],
};

/**
 * Determines the country data (countryCode, dialCode) based on the provided phone number.
 * This function employs a multi-step approach to identify the country code:
 * - If the phone number starts with '+', it extracts the numeric characters
 *   and matches the leading digits with known dial codes mapped to countries.
 * - For matched dial codes, it further filters based on country-specific regex patterns
 *   to validate the phone number format for those countries.
 * - If the phone number doesn't start with '+', it directly matches the number
 *   against regular expressions associated with various countries to identify the code.
 *
 * @param phoneNumber The input phone number (string or number).
 * @returns The detected countryCode & dialCode or an empty strings in both if not found.
 */
const detectCountryAndDialCodeFromPhone = (phoneNumber) => {
    // If the phone number starts with '+', extract numeric characters
    if (phoneNumber.toString().charAt(0) === '+') {
        const cleanedPhoneNumberWithoutPlusPrefix = phoneNumber
            .toString()
            .replace(/\D/g, '');
        const matchingCountries = [];
        // Iterate through dial codes and check for matches with cleaned phone number
        for (const code in DIAL_CODE_MAPPER) {
            if (cleanedPhoneNumberWithoutPlusPrefix.startsWith(code)) {
                matchingCountries.push(...DIAL_CODE_MAPPER[code].map((item) => ({
                    countryCode: item,
                    dialCode: `+${code}`,
                })));
            }
        }
        // Filter matching countries based on phone number validation regex
        const matchedCountryCode = matchingCountries.find((country) => {
            const regex = PHONE_REGEX_MAPPER[country.countryCode];
            if (regex && regex.test(phoneNumber.toString()))
                return country;
            return undefined;
        });
        // Return the first matched country code, if any
        return (matchedCountryCode || {
            countryCode: '',
            dialCode: '',
        });
    }
    else {
        // If phone number doesn't start with '+', directly match against country regexes
        for (const countryCode in PHONE_REGEX_MAPPER) {
            const regex = PHONE_REGEX_MAPPER[countryCode];
            if (regex.test(phoneNumber.toString())) {
                return {
                    countryCode: countryCode,
                    dialCode: getDialCodeFromCountryCode(countryCode)
                        ? `+${getDialCodeFromCountryCode(countryCode)}`
                        : '',
                };
            }
        }
    }
    // Return empty string if no country code is detected
    return { countryCode: '', dialCode: '' };
};
const cleanPhoneNumber = (phoneNumber) => {
    // Regular expression to match all characters except numbers and + sign at the start
    const regex = /[^0-9+]|(?!A)\+/g;
    // Replace matched characters with an empty string
    const cleanedPhoneNumber = phoneNumber.replace(regex, '');
    return phoneNumber[0] === '+' ? `+${cleanedPhoneNumber}` : cleanedPhoneNumber;
};
/**
 * Returns the dial code mapped for the country code passed from DIAL_CODE_MAPPER
 */
const getDialCodeFromCountryCode = (countryCode) => {
    for (const dialCode in DIAL_CODE_MAPPER) {
        if (DIAL_CODE_MAPPER[dialCode].includes(countryCode.toUpperCase())) {
            return dialCode;
        }
    }
    return '';
};

// Validates whether a given phone number is valid based on the provided country code or auto-detects the country code and checks if the number matches the defined regex pattern for that country.
const isValidPhoneNumber = (phoneNumber, countryCode) => {
    // Clean the provided phoneNumber by removing non-numeric characters
    const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber.toString());
    // Detect or validate the country code
    countryCode = (countryCode && countryCode in PHONE_REGEX_MAPPER
        ? countryCode
        : detectCountryAndDialCodeFromPhone(cleanedPhoneNumber).countryCode);
    // Return false if phoneNumber is empty
    if (!phoneNumber)
        return false;
    // Check if the countryCode exists in the PHONE_REGEX_MAPPER
    if (countryCode in PHONE_REGEX_MAPPER) {
        // Fetch the regex pattern for the countryCode
        const regex = PHONE_REGEX_MAPPER[countryCode];
        // Test if the cleanedPhoneNumber matches the regex pattern
        return regex.test(cleanedPhoneNumber);
    }
    // Return false if the countryCode is not supported
    return false;
};
var isValidPhoneNumber$1 = withErrorBoundary(isValidPhoneNumber);

const PHONE_FORMATTER_MAPPER = {
    IN: 'xxxx xxxxxx',
    MY: 'xx xxxxx xx',
    AE: 'xx xxx xxxx',
    AL: 'xxx xx xxxx',
    AM: 'xx xx xx xx',
    AR: 'xxxx-xxxx',
    AU: 'xxx xxx xxx',
    AW: 'xxx-xxxx',
    BB: 'xxx-xxxx',
    BD: 'xxxx-xxxxxx',
    BM: 'xxx-xxxx',
    BN: 'xxxx-xxxx',
    BO: 'xxxx-xxxx',
    BS: 'xxx-xxxx',
    BW: 'xx xxxx xxxx',
    BZ: 'xxx-xxxx',
    CA: 'xxx-xxx-xxxx',
    CH: 'xxx xxx xxx',
    CN: 'xxxx-xxxxxxx',
    CO: 'xxxx-xxxxxxx',
    CR: 'xxxx-xxxx',
    CU: 'xxxx-xxxx',
    CZ: 'xxx xxx xxx',
    DK: 'xx xx xx xx',
    DO: 'xxx-xxxxxxx',
    DZ: 'xxxx-xxxx-xxx',
    EG: 'xx xxx xxxx',
    ET: 'xx xxx xxxx',
    EU: 'xxx xx xx xx',
    FJ: 'xxxx xxxx',
    GB: 'xxxx xxx xxx',
    GH: 'xxx xxx xxxx',
    GI: 'xxxx xxxx',
    GM: 'xxxx-xxxx',
    GT: 'xxxx-xxxx',
    GY: 'xxx-xxxx',
    HK: 'xxxx xxxx',
    HN: 'xxxx-xxxx',
    HR: 'xxx xxx xxxx',
    HT: 'xxx-xxxx',
    HU: 'xxx xxx xxxx',
    ID: 'xxxx-xxxx-xxxx',
    IL: 'xxxx-xxx-xxx',
    JM: 'xxx-xxxx',
    KE: 'xxx xxxxxx',
    KG: 'xxx-xx-xx-xx',
    KH: 'xxx-xxx-xxx',
    KY: 'xxx-xxxx',
    KZ: 'xxx-xxx-xx-xx',
    LA: 'xxx xx xxxx',
    LK: 'xx xxx xxxx',
    LR: 'xxx-xxx-xxxx',
    LS: 'xxx xx xxxx',
    LT: 'xxx xxxxx',
    LU: 'xxx xx xxx',
    LV: 'xxxx xxxx',
    MA: 'xxxx-xxxxxx',
    MD: 'xx xxxxxx',
    ME: 'xx xxxxxx',
    MG: 'xx xx xx xx xx',
    MK: 'xx xx xx xx',
    MM: 'xx xxxxxx',
    MN: 'xxx-xx-xxxx',
    MO: 'xxxx xxxx',
    MU: 'xx xxxx xxxx',
    MV: 'xxxxxx',
    MW: 'xx xxxx xxxx',
    MX: 'xxx-xxx-xxxx',
    MZ: 'xx xxxxxxx',
    NA: 'xx xxxx xxxx',
    NG: 'xxx xxx xxxx',
    NI: 'xxxx-xxxx',
    NL: 'xxx-xxxxxxx',
    NO: 'xxxx xxxx',
    NP: 'xxxx-xxxxxxx',
    NZ: 'xxx-xxxxxxx',
    OM: 'xxxx-xxxx',
    PA: 'xxx-xxxx',
    PE: 'xxx-xxx-xxx',
    PG: 'xxx-xxxxxx',
    PH: 'xxx-xxxx',
    PK: 'xxx-xxxxxxx',
    PL: 'xxx xxx xxx',
    PR: 'xxx-xxx-xxxx',
    PS: 'xxxx-xxxxxxx',
    PT: 'xxx xxx xxx',
    PY: 'xxx-xxxxxx',
    QA: 'xxxx xxxx',
    RO: 'xxx xxx xxxx',
    RS: 'xxx xxxxx',
    RU: 'xxx xxx-xx-xx',
    RW: 'xxx xxxxxx',
    SA: 'xxx-xxxxxxx',
    SC: 'xx xxxxx',
    SE: 'xxx-xxx xx xx',
    SG: 'xxxx xxxx',
    SI: 'xx xxxxxx',
    SK: 'xxx xxx xxx',
    SL: 'xxx-xxxxxx',
    SM: 'xxxxx xxxxx',
    SN: 'xx xxx xx xx',
    SO: 'xxx xxxxxxx',
    SR: 'xxx-xxxx',
    SS: 'xxx xxxx xxx',
    SV: 'xxxx-xxxx',
    SZ: 'xxx xx xxxx',
    TG: 'xx xx xx xx',
    TH: 'xxx-xxxxxxx',
    TJ: 'xxx xx xx xx',
    TL: 'xxx-xxxxxxx',
    TN: 'xx xxxxxx',
    TR: 'xxx xxx xx xx',
    TT: 'xxx-xxxx',
    TW: 'xxxx-xxxxxx',
    TZ: 'xxx xxx xxxx',
    UA: 'xx xxx xx xx',
    UG: 'xxx xxxxxxx',
    US: 'xxx-xxx-xxxx',
    UY: 'xxx-xxxxx',
    UZ: 'xxx-xxx-xx-xx',
    VC: 'xxx-xxxx',
    VE: 'xxxx-xxx-xxxx',
    VN: 'xxxx-xxxxxxx',
    YE: 'xxxx-xxxx',
    ZA: 'xxx-xxx-xxxx',
    ZM: 'xxx-xxxxxxx',
    ZW: 'xx xxx xxxx',
    KW: 'xxx xx xxxx',
    BH: 'xxxx xxxx',
    AG: 'xxx-xxxx',
    AI: 'xxx-xxxx',
    AS: 'xxx-xxxx',
    DM: 'xxx-xxxx',
    GD: 'xxx-xxxx',
    GU: 'xxx-xxxx',
    KN: 'xxx-xxxx',
    LC: 'xxx-xxxx',
    MP: 'xxx-xxxx',
    MS: 'xxx-xxxx',
    SX: 'xxx-xxxx',
    TC: 'xxx-xxxx',
    VG: 'xxx-xxxx',
    VI: 'xxx-xxxx',
    GR: 'xx xxx xxxx',
    BE: 'xxx xx xx xx',
    FR: 'xx xx xx xx xx',
    ES: 'xxx xxx xxx',
    IT: 'xxx xxxx xxxx',
    VA: 'xxx xxxx xxxx',
    AT: 'xxx xxxxxxxx',
    GG: 'xxxx xxxx',
    IM: 'xxxx xxxx',
    JE: 'xxxx xxxx',
    SJ: 'xxx xx xxx',
    DE: 'xxx xxxxxxxx',
    BR: 'xx xxxx-xxxx',
    CL: 'x xxxx xxxx',
    CC: 'xxx xxxx xxxx',
    CX: 'xxx xxxx xxxx',
    JP: 'xx xxxx xxxx',
    KR: 'xx xxxx xxxx',
    AF: 'xx xxx xxxx',
    IR: 'xx xxxx xxxx',
    EH: 'xx xx xx xx',
    LY: 'xx xxxxx xxxx',
    MR: 'xx xx xx xx',
    ML: 'xx xx xx xx',
    GN: 'xx xx xx xx',
    CI: 'xx xx xx xx',
    BF: 'xx xx xx xx',
    NE: 'xx xx xx xx',
    BJ: 'xx xx xx xx',
    TD: 'xx xx xx xx',
    CF: 'xx xx xx xx',
    CM: 'xx xx xx xx',
    CV: 'xxx xxxx',
    ST: 'xx xxx xx',
    GQ: 'xx xxx xxxx',
    GA: 'xx xx xx xx',
    CG: 'xx xx xx xx',
    CD: 'xx xxx xxxx',
    AO: 'xx xxx xxxx',
    GW: 'xx xx xx xx',
    IO: 'xxx xxxx',
    AC: 'xxxx',
    SD: 'xx xxx xxxx',
    DJ: 'xx xx xx xx',
    BI: 'xx xx xx xx',
    RE: 'xxx xx xx xx',
    YT: 'xxx xx xx xx',
    KM: 'xx xx xx xx',
    SH: 'xxxx',
    TA: 'xxxx',
    ER: 'x xxx xxxx',
    FO: 'xxx xxx',
    GL: 'xx xx xx',
    IE: 'xx xxx xxxx',
    IS: 'xxx xxxx',
    MT: 'xx xx xx xx',
    CY: 'xx xxxxxx',
    FI: 'xx xxx xxxx',
    AX: 'xxx xxx',
    AD: 'xxx xxx',
    MC: 'xx xx xx xx',
    XK: 'xx xxx xxxx',
    LI: 'xxx xx xx',
    PM: 'xxx xxxx',
    GP: 'xxx xx xx xx',
    MF: 'xxx xx xx xx',
    GF: 'xxx xx xx xx',
    MQ: 'xxx xx xx xx',
    NF: 'x xxxx',
    NR: 'xxx xxxx',
    TO: 'xxxxx',
    SB: 'xxxxx',
    VU: 'xx xxxxx',
    PW: 'xxx xxxx',
    WF: 'xx xxxx',
    CK: 'xx xxx',
    NU: 'xxxx',
    WS: 'xx xxxxx',
    KI: 'xx xxx',
    NC: 'xx xx xx',
    TV: 'xxxxx',
    PF: 'xx xx xx xx',
    TK: 'xxxx',
    FM: 'xxx xxxx',
    MH: 'xxx xxxx',
    KP: 'xx xxx xxxx',
    LB: 'xx xxx xxx',
    JO: 'xx xxxx xxxx',
    SY: 'xx xxxx xxxx',
    IQ: 'xx xxx xxxx',
    BT: 'x xxx xxx',
    TM: 'x xxx xxx',
    AZ: 'xx xxx xx xx',
    GE: 'xxx xxx xxx',
    AQ: 'xx xxxx',
    BG: 'xx xxx xxxx',
    EE: 'xxx xxxx',
    BY: 'xx xxx-xx-xx',
    BA: 'xx xxx-xxxx',
    FK: 'xxxxx',
    BL: 'xxx xx xx xx',
    EC: 'xx xxx xxxx',
    CW: 'xxx xxxx',
    BQ: 'xxx xxxx',
};

// Formats a provided phone number according to the predefined format for a specific country code, or auto-detects the country code and formats the number accordingly.
const formatPhoneNumber = (phoneNumber, countryCode) => {
    // Throw errors if phoneNumber is invalid
    if (!phoneNumber)
        throw new Error('Parameter `phoneNumber` is invalid!');
    // Convert phoneNumber to string and clean it by removing non-numeric characters
    phoneNumber = phoneNumber.toString();
    phoneNumber = cleanPhoneNumber(phoneNumber);
    // Detect or validate the country code
    countryCode = (countryCode && countryCode in PHONE_FORMATTER_MAPPER
        ? countryCode
        : detectCountryAndDialCodeFromPhone(phoneNumber).countryCode);
    // Fetch the pattern for the countryCode from the PHONE_FORMATTER_MAPPER
    const pattern = PHONE_FORMATTER_MAPPER[countryCode];
    if (!pattern)
        return phoneNumber;
    // Count the number of 'x' characters in the format pattern
    let charCountInFormatterPattern = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 'x') {
            charCountInFormatterPattern++;
        }
    }
    // Calculate the difference between phoneNumber length and 'x' characters count in pattern
    const diff = phoneNumber.length - charCountInFormatterPattern;
    // Extract the phoneNumber without the prefix
    const phoneNumberWithoutPrefix = phoneNumber.slice(diff);
    const formattedNumber = [];
    let numberIndex = 0;
    // Loop through the pattern to format the phoneNumber
    for (let i = 0; i < pattern.length; i++) {
        const patternChar = pattern[i];
        if (patternChar === 'x') {
            // Insert phoneNumber digits at 'x' positions
            if (numberIndex < phoneNumberWithoutPrefix.length) {
                formattedNumber.push(phoneNumberWithoutPrefix[numberIndex]);
                numberIndex++;
            }
        }
        else {
            // Insert non-digit characters from the pattern
            formattedNumber.push(patternChar);
        }
    }
    // Join the formattedNumber array to create the formattedPhoneNumber without prefix
    const formattedPhoneNumberWithoutPrefix = formattedNumber.join('');
    // Combine the prefix and formattedPhoneNumberWithoutPrefix
    const formattedPhoneNumberWithPrefix = phoneNumber.slice(0, diff) + ' ' + formattedPhoneNumberWithoutPrefix;
    // Return the formattedPhoneNumber with prefix after trimming whitespace
    return formattedPhoneNumberWithPrefix.trim();
};
var formatPhoneNumber$1 = withErrorBoundary(formatPhoneNumber);

// Parses a given phone number, identifies its country code (if not provided), and returns an object with details including the country code, formatted phone number, dial code, and format template.
const parsePhoneNumber = (phoneNumber, country) => {
    // Throw errors if phoneNumber is invalid
    if (!phoneNumber)
        throw new Error('Parameter `phoneNumber` is invalid!');
    // Clean the phoneNumber by removing non-numeric characters
    phoneNumber = phoneNumber.toString();
    phoneNumber = cleanPhoneNumber(phoneNumber);
    const countryData = detectCountryAndDialCodeFromPhone(phoneNumber);
    // Detect or validate the country code
    const countryCode = (country && country in PHONE_FORMATTER_MAPPER
        ? country
        : countryData.countryCode);
    const dialCode = countryData.dialCode;
    // Format the phone number using the detected/validated country code
    const formattedPhoneNumber = formatPhoneNumber$1(phoneNumber, countryCode);
    // Fetch the pattern associated with the countryCode from the PHONE_FORMATTER_MAPPER
    const pattern = PHONE_FORMATTER_MAPPER[countryData.countryCode];
    if (!pattern)
        return {
            countryCode,
            dialCode,
            formattedPhoneNumber: phoneNumber,
            formatTemplate: '',
            phoneNumber,
        };
    // Count the number of 'x' characters in the format pattern
    let charCountInFormatterPattern = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 'x') {
            charCountInFormatterPattern++;
        }
    }
    // Calculate the difference between phoneNumber length and 'x' characters count in pattern
    const diff = phoneNumber.length - charCountInFormatterPattern;
    // Obtain the format template associated with the countryCode
    const formatTemplate = PHONE_FORMATTER_MAPPER[countryCode];
    // Return the parsed phone number information
    return {
        phoneNumber: phoneNumber.slice(diff),
        countryCode,
        dialCode,
        formattedPhoneNumber: pattern ? formattedPhoneNumber : phoneNumber,
        formatTemplate: formatTemplate || '',
    };
};
var parsePhoneNumber$1 = withErrorBoundary(parsePhoneNumber);

/**
 * Retrieves a mapping of country codes to their respective international dial codes.
 * @returns {Object} An object where each key is a country code (e.g., 'US', 'CA') and its value is the corresponding dial code (e.g., '+1' for 'US' and 'CA').
 */
const getDialCodes = () => {
    const countryDialCode = {};
    for (const [dialCode, countryCodes] of Object.entries(DIAL_CODE_MAPPER)) {
        countryCodes.forEach((countryCode) => {
            countryDialCode[countryCode] = `+${Number(dialCode)}`;
        });
    }
    return countryDialCode;
};
var getDialCodes$1 = withErrorBoundary(getDialCodes);

/**
 * Retrieves the dial code for a specified country code.
 *
 * @param countryCode The country code for which the dial code is to be retrieved.
 *                    It must be a key of the object returned by the `getDialCodes` function.
 * @returns The corresponding dial code as a string.
 * @throws An error if the provided country code is not found in the dial code mapping.
 */
const getDialCodeByCountryCode = (countryCode) => {
    // Get the mapping of all country codes to their respective dial codes
    const dialCodeForAllCountries = getDialCodes$1();
    /** Check if the provided country code exists in the mapping.
     * Return the corresponding dial code if the country code is valid.
     * Throw an error if the country code is not found in the mapping
     * */
    if (countryCode in dialCodeForAllCountries)
        return dialCodeForAllCountries[countryCode];
    else
        throw new Error(`Invalid countryCode: ${countryCode}`);
};
var getDialCodeByCountryCode$1 = withErrorBoundary(getDialCodeByCountryCode);

export { formatPhoneNumber$1 as formatPhoneNumber, getDialCodeByCountryCode$1 as getDialCodeByCountryCode, getDialCodes$1 as getDialCodes, isValidPhoneNumber$1 as isValidPhoneNumber, parsePhoneNumber$1 as parsePhoneNumber };
//# sourceMappingURL=index.js.map
