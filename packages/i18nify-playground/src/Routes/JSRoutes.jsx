import { useRoutes } from 'react-router-dom';

import React from 'react';
import { IntlOptionsDateProvider } from 'src/context/intlOptionsDateContext';

import ConvertToMajorUnit from 'src/pages/CurrencyAndNumber/convertToMajorUnit';
import ConvertToMinorUnit from 'src/pages/CurrencyAndNumber/convertToMinorUnit';
import CurrencyAndNumberOverview from 'src/pages/CurrencyAndNumber/CurrencyAndNumberOverview';
import FormatNumber from 'src/pages/CurrencyAndNumber/formatNumber';
import GetCurrencyList from 'src/pages/CurrencyAndNumber/getCurrencyList';
import GetCurrencySymbol from 'src/pages/CurrencyAndNumber/getCurrencySymbol';

import FormatDateTime from 'src/pages/Date/formatDateTime';
import GetRelativeTime from 'src/pages/Date/getRelativeTime';
import GetWeekdays from 'src/pages/Date/getWeekdays';
import ParseDateTime from 'src/pages/Date/parseDateTime';

import DateOverview from 'src/pages/Date/DateOverview';
import GeoOverview from 'src/pages/Geo/GeoOverview';

import Home from 'src/pages/Home/Home';

import FormatPhoneNumber from 'src/pages/Phone/formatPhoneNumber';
import GetDialCodeByCountryCode from 'src/pages/Phone/getDialCodeByCountryCode';
import GetDialCodes from 'src/pages/Phone/getDialCodes';
import GetMaskedPhoneNumber from 'src/pages/Phone/getMaskedPhoneNumber';
import IsValidPhoneNumberView from 'src/pages/Phone/isValidPhoneNumber';
import ParsePhoneNumber from 'src/pages/Phone/parsePhoneNumber';
import PhoneNumberOverview from 'src/pages/Phone/phoneNumberOverview';
import FormatNumberByParts from 'src/pages/CurrencyAndNumber/formatNumberByParts';
import BankingOverview from 'src/pages/Banking/bankingOverview';
import GetListOfBanks from 'src/pages/Banking/getListOfBanks';

import DashboardLayout from 'src/components/Dashboard/Dashboard';
import ComingSoon from 'src/components/Dashboard/ComingSoon';
import GetAllCountries from 'src/pages/Geo/getAllCountries';
import GetCities from 'src/pages/Geo/getCities';
import GetFlagOfCountry from 'src/pages/Geo/getFlagOfCountry';
import GetFlagsForAllCountries from 'src/pages/Geo/getFlagsForAllCountries';
import GetStates from 'src/pages/Geo/getStates';
import GetZipcodes from 'src/pages/Geo/getZipcodes';

export default function JSRoutes() {
  const routes = useRoutes([
    {
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
          index: true,
        },
        {
          path: '/i18nify-js',
          element: <Home />,
          index: true,
        },
        {
          path: 'i18nify-js/number/overview',
          element: <CurrencyAndNumberOverview />,
        },
        {
          path: 'i18nify-js/number/formatNumber',
          element: <FormatNumber />,
        },
        {
          path: 'i18nify-js/number/formatNumberByParts',
          element: <FormatNumberByParts />,
        },
        {
          path: 'i18nify-js/number/getCurrencyList',
          element: <GetCurrencyList />,
        },
        {
          path: 'i18nify-js/number/getCurrencySymbol',
          element: <GetCurrencySymbol />,
        },
        {
          path: 'i18nify-js/number/convertToMajorUnit',
          element: <ConvertToMajorUnit />,
        },
        {
          path: 'i18nify-js/number/convertToMinorUnit',
          element: <ConvertToMinorUnit />,
        },

        { path: 'i18nify-js/phone/overview', element: <PhoneNumberOverview /> },
        {
          path: 'i18nify-js/phone/isValidPhoneNumber',
          element: <IsValidPhoneNumberView />,
        },
        {
          path: 'i18nify-js/phone/formatPhoneNumber',
          element: <FormatPhoneNumber />,
        },
        {
          path: 'i18nify-js/phone/parsePhoneNumber',
          element: <ParsePhoneNumber />,
        },
        { path: 'i18nify-js/phone/getDialCodes', element: <GetDialCodes /> },
        {
          path: 'i18nify-js/phone/getDialCodeByCountryCode',
          element: <GetDialCodeByCountryCode />,
        },
        {
          path: 'i18nify-js/phone/getMaskedPhoneNumber',
          element: <GetMaskedPhoneNumber />,
        },
        {
          path: 'i18nify-js/geo/getFlagsForAllCountries',
          element: <GetFlagsForAllCountries />,
        },
        {
          path: 'i18nify-js/geo/getFlagOfCountry',
          element: <GetFlagOfCountry />,
        },

        {
          path: 'i18nify-js/geo/getAllCountries',
          element: <GetAllCountries />,
        },
        {
          path: 'i18nify-js/geo/getStates',
          element: <GetStates />,
        },
        {
          path: 'i18nify-js/geo/getCities',
          element: <GetCities />,
        },
        {
          path: 'i18nify-js/geo/getZipcodes',
          element: <GetZipcodes />,
        },
        {
          path: 'i18nify-js/geo/overview',
          element: <GeoOverview />,
        },
        {
          path: 'i18nify-js/date/overview',
          element: (
            <IntlOptionsDateProvider>
              <DateOverview />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'i18nify-js/date/formatDateTime',
          element: (
            <IntlOptionsDateProvider>
              <FormatDateTime />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'i18nify-js/date/getRelativeTime',
          element: (
            <IntlOptionsDateProvider>
              <GetRelativeTime />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'i18nify-js/date/getWeekdays',
          element: (
            <IntlOptionsDateProvider>
              <GetWeekdays />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'i18nify-js/date/parseDateTime',
          element: (
            <IntlOptionsDateProvider>
              <ParseDateTime />
            </IntlOptionsDateProvider>
          ),
        },
        { path: 'i18nify-js/banking/overview', element: <BankingOverview /> },
        {
          path: 'i18nify-js/banking/getListOfBanks',
          element: <GetListOfBanks />,
        },
        { path: 'i18nify-js/salutation', element: <ComingSoon /> },
        { path: 'i18nify-js/localisation', element: <ComingSoon /> },
      ],
    },
  ]);

  return routes;
}
