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
        description={`This module's your go-to guru for everything Phone Number related.
            🤑 It's all about formatting, validations, and handy tricks to make
            dealing with phone numbers a breeze. Here are the cool APIs and
            utilities this Phone Number Module gives you to play with! 🚀💸`}
        apiItems={phoneNumberLinks}
      />
    </>
  );
};

export default PhoneNumberOverview;
