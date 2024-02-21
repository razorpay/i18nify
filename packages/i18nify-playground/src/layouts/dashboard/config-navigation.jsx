import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: 'Overview',
    path: '/',
    icon: icon('ic_home'),
  },
  {
    title: 'Currency & Number',
    path: '/number',
    icon: icon('ic_currency'),
    children: [
      { title: 'FormatNumber', path: '/number/formatNumber' },
      { title: 'FormatNumberByParts', path: '/number/formatNumberByParts' },
      { title: 'GetCurrencyList', path: '/number/getCurrencyList' },
      { title: 'GetCurrencySymbol', path: '/number/getCurrencySymbol' },
      { title: 'ConvertToMajorUnit', path: '/number/convertToMajorUnit' },
      { title: 'ConvertToMinorUnit', path: '/number/convertToMinorUnit' },
    ],
  },
  {
    title: 'Phone',
    path: '/phone',
    icon: icon('ic_phone'),
    children: [
      { title: 'IsValidPhoneNumber', path: '/phone/isValidPhoneNumber' },
      { title: 'FormatPhoneNumber', path: '/phone/formatPhoneNumber' },
      { title: 'ParsePhoneNumber', path: '/phone/parsePhoneNumber' },
    ],
  },
  {
    title: 'Date',
    path: '/date',
    icon: icon('ic_date'),
    children: [
      { title: 'FormatDate', path: '/date/formatDate' },
      { title: 'FormatDateTime', path: '/date/formatDateTime' },
      { title: 'FormatTime', path: '/date/formatTime' },
      { title: 'GetRelativeTime', path: '/date/getRelativeTime' },
      { title: 'GetWeekdays', path: '/date/getWeekdays' },
      { title: 'IsValidDate', path: '/date/isValidDate' },
      { title: 'ParseDateTime', path: '/date/parseDateTime' },
    ],
  },
  {
    title: 'Geo',
    path: '/geo',
    icon: icon('ic_geo'),
    children: [
      { title: 'GetFlagByCountry', path: '/geo/getFlagByCountry' },
      { title: 'GetListOfAllFlags', path: '/geo/getListOfAllFlags' },
      { title: 'GetAllContinents', path: '/geo/getAllContinents' },
      { title: 'GetAllCountries', path: '/geo/getAllCountries' },
      {
        title: 'GetCountriesByContinent',
        path: '/geo/getCountriesByContinent',
      },
      { title: 'GetStatesByCountry', path: '/geo/getStatesByCountry' },
      { title: 'GetCities', path: '/geo/getCities' },
    ],
  },
  {
    title: 'Salutation',
    path: '/salutation',
    icon: icon('ic_salutation'),
  },
  {
    title: 'Localisation',
    path: '/localisation',
    icon: icon('ic_lang'),
  },
  {
    title: 'Bank codes',
    path: '/banking',
    icon: icon('ic_bank'),
  },
  // {
  //   title: 'State',
  //   path: '/state',
  //   icon: icon('ic_state'),
  //   children: [
  //     { title: 'GetState', path: '/state/getState' },
  //     { title: 'SetState', path: '/state/setState' },
  //   ],
  // },
  // {
  //   title: 'Plugins',
  //   path: '/plugins',
  //   icon: icon('ic_plugin'),
  // },
];

export default navConfig;
