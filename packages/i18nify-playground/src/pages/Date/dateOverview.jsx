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
        description={`📅 Your comprehensive toolkit for handling dates and times across the globe! 🌍 Features include date parsing, formatting, validation, and timezone support with locale awareness. 🔄 Perfect for apps dealing with global scheduling, the module handles date-time validations, timezone conversions, and formatting with built-in locale support. 💫 Includes utilities for relative time, weekday management, and format handling based on regional standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent date and time handling across your application.`}
        apiItems={dateLinks}
      />
    </>
  );
}
