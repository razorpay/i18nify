import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getNavConfig } from 'src/components/Dashboard/constants/navConfig';
import Overview from 'src/components/Dashboard/Overview';

const PhoneNumberOverview = () => {
  const phoneNumberLinks = getNavConfig().find((item) =>
    item.path.toLowerCase().includes('phone'),
  ).children;

  return (
    <>
      <Helmet>
        <title> i18nify | Phone Number </title>
      </Helmet>

      <Overview
        title="Phone Number module"
        description={`📱 Your comprehensive toolkit for handling international phone numbers! 🌍 Features include phone number parsing, formatting, validation, and masking with locale support. 🔄 Perfect for apps dealing with global user data, the module handles phone number validations, country code detection, and formatting with built-in locale awareness. 💫 Includes utilities for dial code management, number cleaning, and format handling based on regional standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent phone number handling across your application.`}
        apiItems={phoneNumberLinks}
      />
    </>
  );
};

export default PhoneNumberOverview;
