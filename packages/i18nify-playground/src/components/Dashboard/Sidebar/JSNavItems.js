import {
  BankIcon,
  BuildingIcon,
  CalendarIcon,
  GlobeIcon,
  HomeIcon,
  PhoneIcon,
  SourceToPayIcon,
} from '@razorpay/blade/components';

export const JS_NAV_ITEMS = [
  {
    type: 'section',
    title: undefined,
    href: '/i18nify-js',
    items: [
      {
        title: 'Intro',
        href: '/i18nify-js',
      },
    ],
    icon: HomeIcon,
  },
  {
    section: 'APIS',
    title: `API's`,
    href: '/i18nify-js',
    icon: BuildingIcon,
    items: [
      {
        title: 'Currency and Number',
        icon: SourceToPayIcon,
        href: '/i18nify-js/number',
        items: [
          {
            title: 'Overview',
            href: '/i18nify-js/number/overview',
            icon: SourceToPayIcon,
          },
          {
            title: 'formatNumber',
            href: '/i18nify-js/number/formatNumber',
          },
          {
            title: 'formatNumberByParts',
            href: '/i18nify-js/number/formatNumberByParts',
          },
          {
            title: 'getCurrencyList',
            href: '/i18nify-js/number/getCurrencyList',
          },
          {
            title: 'getCurrencySymbol',
            href: '/i18nify-js/number/getCurrencySymbol',
          },
          {
            title: 'convertToMajorUnit',
            href: '/i18nify-js/number/convertToMajorUnit',
          },
          {
            title: 'convertToMinorUnit',
            href: '/i18nify-js/number/convertToMinorUnit',
          },
        ],
      },
      {
        title: 'Phone',
        href: '/i18nify-js/phone',
        icon: PhoneIcon,
        items: [
          {
            title: 'Overview',
            href: '/i18nify-js/phone/overview',
          },
          {
            title: 'IsValidPhoneNumber',
            href: '/i18nify-js/phone/isValidPhoneNumber',
          },
          {
            title: 'formatPhoneNumber',
            href: '/i18nify-js/phone/formatPhoneNumber',
          },
          {
            title: 'parsePhoneNumber',
            href: '/i18nify-js/phone/parsePhoneNumber',
          },
          { title: 'getDialCodes', href: '/i18nify-js/phone/getDialCodes' },
          {
            title: 'getDialCodeByCountryCode',
            href: '/i18nify-js/phone/getDialCodeByCountryCode',
          },
          {
            title: 'getMaskedPhoneNumber',
            href: '/i18nify-js/phone/getMaskedPhoneNumber',
          },
        ],
      },
      {
        title: 'Date',
        href: '/i18nify-js/date',
        icon: CalendarIcon,
        items: [
          { title: 'Overview', href: '/i18nify-js/date/overview' },
          { title: 'formatDateTime', href: '/i18nify-js/date/formatDateTime' },
          {
            title: 'getRelativeTime',
            href: '/i18nify-js/date/getRelativeTime',
          },
          { title: 'getWeekdays', href: '/i18nify-js/date/getWeekdays' },
          { title: 'parseDateTime', href: '/i18nify-js/date/parseDateTime' },
        ],
      },

      {
        title: 'Geo',
        href: '/i18nify-js/geo',
        icon: GlobeIcon,
        items: [
          { title: 'Overview', href: '/i18nify-js/geo/overview' },
          {
            title: 'getFlagOfCountry',
            href: '/i18nify-js/geo/getFlagOfCountry',
          },
          {
            title: 'getFlagsForAllCountries',
            href: '/i18nify-js/geo/getFlagsForAllCountries',
          },
          { title: 'getAllCountries', href: '/i18nify-js/geo/getAllCountries' },
          { title: 'getStates', href: '/i18nify-js/geo/getStates' },
          { title: 'getCities', href: '/i18nify-js/geo/getCities' },
          { title: 'getZipcodes', href: '/i18nify-js/geo/getZipcodes' },
        ],
      },
      {
        title: 'Banking',
        href: '/i18nify-js/banking',
        icon: BankIcon,
        items: [
          { title: 'Overview', href: '/i18nify-js/banking/overview' },
          {
            title: 'getListOfBanks',
            href: '/i18nify-js/banking/getListOfBanks',
          },
        ],
      },
      {
        title: 'Salutation',
        href: '/i18nify-js/salutation',
        icon: BuildingIcon,
      },
      {
        title: 'Localisation',
        href: '/i18nify-js/localisation',
        icon: BuildingIcon,
      },
    ],
  },
];
