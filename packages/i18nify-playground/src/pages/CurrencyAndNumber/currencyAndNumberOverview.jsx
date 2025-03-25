import React from 'react';
import { Helmet } from 'react-helmet-async';

import Overview from 'src/components/Dashboard/Overview';
import { getNavConfig } from 'src/components/Dashboard/constants/navConfig';

const CurrencyAndNumberOverview = () => {
  const numberLinks = getNavConfig().find((item) =>
    item.path.toLowerCase().includes('number'),
  ).children;

  return (
    <>
      <Helmet>
        <title> i18nify | Number </title>
      </Helmet>

      <Overview
        title="Currency & Number module"
        description={`💰 Your financial toolkit for handling international currencies with precision! 🌍 Features include currency symbol retrieval, currency list management, and number formatting with locale support. 🔄 Perfect for apps dealing with global transactions, the module handles currency validations, conversions, and formatting with built-in locale awareness. 💫 Includes utilities for currency code validation, symbol placement, and decimal handling based on regional standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent money handling across your application.`}
        apiItems={numberLinks}
      />
    </>
  );
};

export default CurrencyAndNumberOverview;
