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
        description={`🏦 Your comprehensive toolkit for managing banking operations across borders! 🌍 Features include bank list retrieval, bank code validation, and branch information with locale support. 🔄 Perfect for apps dealing with financial institutions, the module handles bank validations, code lookups, and formatting with built-in locale awareness. 💫 Includes utilities for bank code management, branch details, and regional banking standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent banking data handling across your application.`}
        apiItems={bankingLinks}
      />
    </>
  );
};

export default BankingOverview;
