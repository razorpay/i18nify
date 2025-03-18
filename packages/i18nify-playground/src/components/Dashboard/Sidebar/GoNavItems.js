import {
  BankIcon,
  BuildingIcon,
  CalendarIcon,
  GlobeIcon,
  HomeIcon,
  PhoneIcon,
  SourceToPayIcon,
} from '@razorpay/blade/components';

export const GO_NAV_ITEMS = [
  {
    type: 'section',
    title: undefined,
    href: '/i18nify-js',
    items: [
      {
        title: 'Intro',
        href: '/i18nify-go',
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
        href: '/',
        items: [
          {
            title: 'Overview',
            href: '/i18nify-go/number/overview',
            icon: SourceToPayIcon,
          },
          {
            title: 'formatNumber',
            href: '/i18nify-go/number/formatNumber',
          },
          {
            title: 'formatNumberByParts',
            href: '/i18nify-go/number/formatNumberByParts',
          },
          {
            title: 'getCurrencyList',
            href: '/i18nify-go/number/getCurrencyList',
          },
          {
            title: 'getCurrencySymbol',
            href: '/i18nify-go/number/getCurrencySymbol',
          },
          {
            title: 'convertToMajorUnit',
            href: '/i18nify-go/number/convertToMajorUnit',
          },
          {
            title: 'convertToMinorUnit',
            href: '/i18nify-go/number/convertToMinorUnit',
          },
        ],
      },
    ],
  },
];
