import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getNavConfig } from 'src/components/Dashboard/constants/navConfig';
import Overview from 'src/components/Dashboard/Overview';

const BankingOverview = () => {
  const bankingLinks = getNavConfig().find((item) =>
    item.path.toLowerCase().includes('/banking'),
  ).children;

  return (
    <>
      <Helmet>
        <title> i18nify | Banking </title>
      </Helmet>
      <Overview
        title="Banking Module"
        description={`Welcome to the Geo Package 🚀, your all-in-one, supercharged toolkit for sprinkling some
              geographical magic 🧙‍♂️ into your applications! Whether you're looking to jazz up your UI
              with some snazzy SVG flags 🏁, or you need the nitty-gritty details of continents,
              countries, states, cities, and zip codes, we've got you covered!`}
        apiItems={bankingLinks}
      />
    </>
  );
};

export default BankingOverview;
