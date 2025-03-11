import { useRoutes } from 'react-router-dom';

import React from 'react';

import ConvertToMajorUnit from 'src/pages/CurrencyAndNumber/convertToMajorUnit';
import ConvertToMinorUnit from 'src/pages/CurrencyAndNumber/convertToMinorUnit';
import CurrencyAndNumberOverview from 'src/pages/CurrencyAndNumber/CurrencyAndNumberOverview';
import FormatNumber from 'src/pages/CurrencyAndNumber/formatNumber';
import FormatNumberByParts from 'src/pages/CurrencyAndNumber/formatNumberByParts';
import GetCurrencyList from 'src/pages/CurrencyAndNumber/getCurrencyList';
import GetCurrencySymbol from 'src/pages/CurrencyAndNumber/getCurrencySymbol';
import Home from 'src/pages/Home/Home';
import DashboardLayout from 'src/components/Dashboard/Dashboard';

export default function GoRoutes() {
  const routes = useRoutes([
    {
      element: <DashboardLayout />,
      children: [
        {
          path: '/i18nify-go',
          element: <Home />,
          index: true,
        },
        {
          path: '/i18nify-go/number/overview',
          element: <CurrencyAndNumberOverview />,
        },
        {
          path: '/i18nify-go/number/formatNumber',
          element: <FormatNumber />,
        },
        {
          path: '/i18nify-go/number/formatNumberByParts',
          element: <FormatNumberByParts />,
        },
        {
          path: '/i18nify-go/number/getCurrencyList',
          element: <GetCurrencyList />,
        },
        {
          path: '/i18nify-go/number/getCurrencySymbol',
          element: <GetCurrencySymbol />,
        },
        {
          path: '/i18nify-go/number/convertToMajorUnit',
          element: <ConvertToMajorUnit />,
        },
        {
          path: '/i18nify-go/number/convertToMinorUnit',
          element: <ConvertToMinorUnit />,
        },
        {
          path: '/i18nify-go/number/overview',
          element: <CurrencyAndNumberOverview />,
        },
      ],
    },
  ]);

  return routes;
}
