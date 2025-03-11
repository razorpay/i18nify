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
        description={`This module's your go-to guru for everything
            currency/number-related. 🤑 It's all about formatting, validations,
            and handy tricks to make dealing with money/numbers a breeze. Here
            are the cool APIs and utilities this Currency Module gives you to
            play with! 🚀💸`}
        apiItems={numberLinks}
      />
    </>
  );
};

export default CurrencyAndNumberOverview;
