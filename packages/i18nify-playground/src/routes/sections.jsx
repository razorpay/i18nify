import { Outlet, useRoutes } from 'react-router-dom';

import { Box } from '@mui/material';

import { IntlOptionsDateProvider } from 'src/context/intlOptionsDateContext';

import Home from 'src/pages/home';
import DashboardLayout from 'src/layouts/dashboard';

// Number pages
import NumberPage from 'src/pages/number';
import FormatNumber from 'src/pages/number/formatNumber';
import FormatNumberByParts from 'src/pages/number/formatNumberByParts';
import GetCurrencySymbol from 'src/pages/number/getCurrencySymbol';
import GetCurrencyList from 'src/pages/number/getCurrencyList';
import ConvertToMajorUnit from 'src/pages/number/convertToMajorUnit';
import ConvertToMinorUnit from 'src/pages/number/convertToMinorUnit';

// Phone number pages
import PhoneNumber from 'src/pages/phone/phoneNumber';
import IsValidPhoneNumberView from 'src/pages/phone/isValidPhoneNumber';
import FormatPhoneNumber from 'src/pages/phone/formatPhoneNumber';
import ParsePhoneNumber from 'src/pages/phone/parsePhoneNumber';
import GetDialCodes from 'src/pages/phone/getDialCodes';
import GetDialCodeByCountryCode from 'src/pages/phone/getDialCodeByCountryCode';

// Geo Pages
import GeoPage from 'src/pages/geo';
import GetFlagOfCountry from 'src/pages/geo/getFlagOfCountry';
import GetFlagsForAllCountries from 'src/pages/geo/getFlagsForAllCountries';
import GetAllCountries from 'src/pages/geo/getAllCountries';
import GetCities from 'src/pages/geo/getCities';
import GetZipcodes from 'src/pages/geo/getZipcodes';
import GetStates from 'src/pages/geo/getStates';

// Date Time Pages
import DatePage from 'src/pages/date';
import FormatDateTime from 'src/pages/date/formatDateTime';
import GetRelativeTime from 'src/pages/date/getRelativeTime';
import GetWeekdays from 'src/pages/date/getWeekdays';
import ParseDateTime from 'src/pages/date/parseDateTime';

import ComingSoon from 'src/components/comingSoon';
import GetMaskedPhoneNumber from 'src/pages/phone/getMaskedPhoneNumber';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      ),
      children: [
        {
          element: <Home />,
          index: true,
        },
        {
          path: 'number/formatNumber',
          element: <FormatNumber />,
        },
        {
          path: 'number/formatNumberByParts',
          element: <FormatNumberByParts />,
        },
        {
          path: 'number/getCurrencyList',
          element: <GetCurrencyList />,
        },
        {
          path: 'number/getCurrencySymbol',
          element: <GetCurrencySymbol />,
        },
        {
          path: 'number/convertToMajorUnit',
          element: <ConvertToMajorUnit />,
        },
        {
          path: 'number/convertToMinorUnit',
          element: <ConvertToMinorUnit />,
        },
        {
          path: 'number',
          element: <NumberPage />,
        },
        { path: 'phone', element: <PhoneNumber /> },
        {
          path: 'phone/isValidPhoneNumber',
          element: <IsValidPhoneNumberView />,
        },
        { path: 'phone/formatPhoneNumber', element: <FormatPhoneNumber /> },
        { path: 'phone/parsePhoneNumber', element: <ParsePhoneNumber /> },
        { path: 'phone/getDialCodes', element: <GetDialCodes /> },
        {
          path: 'phone/getDialCodeByCountryCode',
          element: <GetDialCodeByCountryCode />,
        },
        {
          path: 'phone/getMaskedPhoneNumber',
          element: <GetMaskedPhoneNumber />,
        },
        {
          path: 'geo/getFlagsForAllCountries',
          element: <GetFlagsForAllCountries />,
        },
        {
          path: 'geo/getFlagOfCountry',
          element: <GetFlagOfCountry />,
        },

        {
          path: 'geo/getAllCountries',
          element: <GetAllCountries />,
        },
        {
          path: 'geo/getStates',
          element: <GetStates />,
        },
        {
          path: 'geo/getCities',
          element: <GetCities />,
        },
        {
          path: 'geo/getZipcodes',
          element: <GetZipcodes />,
        },
        {
          path: 'geo',
          element: <GeoPage />,
        },
        {
          path: 'date/formatDateTime',
          element: (
            <IntlOptionsDateProvider>
              <FormatDateTime />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'date/getRelativeTime',
          element: (
            <IntlOptionsDateProvider>
              <GetRelativeTime />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'date/getWeekdays',
          element: (
            <IntlOptionsDateProvider>
              <GetWeekdays />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'date/parseDateTime',
          element: (
            <IntlOptionsDateProvider>
              <ParseDateTime />
            </IntlOptionsDateProvider>
          ),
        },
        {
          path: 'date',
          element: (
            <IntlOptionsDateProvider>
              <DatePage />
            </IntlOptionsDateProvider>
          ),
        },
        { path: '/salutation', element: <ComingSoon /> },
        { path: '/localisation', element: <ComingSoon /> },
        { path: '/banking', element: <ComingSoon /> },
        { path: 'state', element: <Box /> },
        { path: 'plugins', element: <Box /> },
      ],
    },
  ]);

  return routes;
}
