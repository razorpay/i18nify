export const DL_CITIES = [
  {
    name: 'Tughlakābād',
    timezone: 'Asia/Kolkata',
    zipcodes: [],
    region_name: 'nan',
  },
  {
    name: 'Sabzi Mandi',
    timezone: 'Asia/Kolkata',
    zipcodes: [],
    region_name: 'nan',
  },
  {
    name: 'Pālam',
    timezone: 'Asia/Kolkata',
    zipcodes: ['517401', '517401'],
    region_name: 'nan',
  },
  {
    name: 'New Delhi',
    timezone: 'Asia/Kolkata',
    zipcodes: ['110001', '110020', '110029', '110084'],
    region_name: 'nan',
  },
];

export const NL_CITIES = [
  {
    name: 'Wokha',
    timezone: 'Asia/Kolkata',
    zipcodes: ['797111', '797111'],
    region_name: 'nan',
  },
  {
    name: 'Mokokchūng',
    timezone: 'Asia/Kolkata',
    zipcodes: ['798607', '798614', '798615', '798618'],
    region_name: 'nan',
  },
  {
    name: 'Kohima',
    timezone: 'Asia/Kolkata',
    zipcodes: ['797001', '797120', '797120', '797120'],
    region_name: 'nan',
  },
  {
    name: 'Dimāpur',
    timezone: 'Asia/Kolkata',
    zipcodes: ['797103', '797103', '797116', '797118'],
    region_name: 'nan',
  },
];
export const INDIA_DATA = {
  country_name: 'India',
  states: {
    DL: {
      name: 'National Capital Territory of Delhi',
      cities: DL_CITIES,
    },
    NL: {
      name: 'Nagaland',
      cities: NL_CITIES,
    },
  },
};

export const COUNTRIES_METADATA = {
  metadata_information: {
    AF: {
      country_name: 'Afghanistan',
      continent_code: 'AS',
      continent_name: 'Asia',
      alpha_3: 'AFG',
      numeric_code: '004',
      flag: 'https://flagcdn.com/af.svg',
      sovereignty: 'UN member state',
      dial_code: '+93',
      supported_currency: ['AFN'],
      timezones: {
        'Asia/Kabul': {
          utc_offset: 'UTC +04:30',
        },
      },
      timezone_of_capital: 'Asia/Kabul',
      locales: {
        fa_AF: {
          name: 'Persian (Afghanistan)',
        },
        ps: {
          name: 'Pashto',
        },
        uz_AF: {
          name: 'Uzbek',
        },
        tk: {
          name: 'Turkmen',
        },
      },
      default_locale: 'fa_AF',
      default_currency: 'AFN',
    },
    IN: {
      country_name: 'India',
      continent_code: 'AS',
      continent_name: 'Asia',
      alpha_3: 'IND',
      numeric_code: '356',
      flag: 'https://flagcdn.com/in.svg',
      sovereignty: 'UN member state',
      dial_code: '+91',
      supported_currency: ['INR'],
      timezones: {
        'Asia/Kolkata': {
          utc_offset: 'UTC +05:30',
        },
      },
      timezone_of_capital: 'Asia/Kolkata',
      locales: {
        en_IN: {
          name: 'English (India)',
        },
        hi: {
          name: 'Hindi',
        },
        bn: {
          name: 'Bangla',
        },
        te: {
          name: 'Telugu',
        },
        mr: {
          name: 'Marathi',
        },
        ta: {
          name: 'Tamil',
        },
        ur: {
          name: 'Urdu',
        },
        gu: {
          name: 'Gujarati',
        },
        kn: {
          name: 'Kannada',
        },
        ml: {
          name: 'Malayalam',
        },
        or: {
          name: 'Odia',
        },
        pa: {
          name: 'Punjabi',
        },
        as: {
          name: 'Assamese',
        },
        bh: {
          name: 'Bihari languages',
        },
        sat: {
          name: 'Santali',
        },
        ks: {
          name: 'Kashmiri',
        },
        ne: {
          name: 'Nepali',
        },
        sd: {
          name: 'Sindhi',
        },
        kok: {
          name: 'Konkani',
        },
        doi: {
          name: 'Dogri',
        },
        mni: {
          name: 'Manipuri',
        },
        sit: {
          name: 'Sino-Tibetan languages',
        },
        sa: {
          name: 'Sanskrit',
        },
        fr: {
          name: 'French',
        },
        lus: {
          name: 'Lushai',
        },
        inc: {
          name: 'Indic languages',
        },
      },
      default_locale: 'en_IN',
      default_currency: 'INR',
    },
  },
};
