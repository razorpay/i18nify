import { useRoutes } from 'react-router-dom';

import React from 'react';

import ComingSoon from 'src/components/Dashboard/ComingSoon';
import DashboardLayout from 'src/components/Dashboard/Dashboard';

export default function GoRoutes() {
  const routes = useRoutes([
    {
      element: <DashboardLayout />,
      children: [
        {
          path: '/i18nify-go',
          element: <ComingSoon />,
          index: true,
        },
      ],
    },
  ]);

  return routes;
}
