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
        description={`Welcome to the Banking Package 🚀, Access a curated, up-to-date list of global and local banks.
        Retrieve detailed bank information, including names, locations, and contacts.
        Integrate effortlessly into your applications with fast, reliable performance.`}
        apiItems={bankingLinks}
      />
    </>
  );
};

export default BankingOverview;
