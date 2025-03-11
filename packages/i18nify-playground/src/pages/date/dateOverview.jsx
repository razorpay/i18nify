import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getNavConfig } from 'src/components/Dashboard/constants/navConfig';
import Overview from 'src/components/Dashboard/Overview';

export default function DateOverview() {
  const dateLinks = getNavConfig().find(
    (item) => item.title.toLowerCase() === 'date',
  ).children;

  return (
    <>
      <Helmet>
        <title> i18nify | Date </title>
      </Helmet>
      <Overview
        title="Date module"
        description={`This module 🧩 leverages the JavaScript Intl API & Date object 📆 to
            offer developers locale-aware tools 🛠️ for formatting and
            manipulating dates and times ⏳ in a user-friendly way.`}
        apiItems={dateLinks}
      />
    </>
  );
}
