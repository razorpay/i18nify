import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getNavConfig } from 'src/components/Dashboard/constants/navConfig';
import Overview from 'src/components/Dashboard/Overview';

const GeoOverview = () => {
  const geoLinks = getNavConfig().find(
    (item) => item.title.toLowerCase() === 'geo',
  ).children;

  return (
    <>
      <Helmet>
        <title> i18nify | Geo </title>
      </Helmet>
      <Overview
        title="Geo module"
        description={`🌍 Your comprehensive toolkit for handling geographical data across borders! 🗺️ Features include country metadata, state/province management, city lookup, and postal code validation with locale support. 🔄 Perfect for apps dealing with global addresses, the module handles location validations, flag retrieval, and formatting with built-in locale awareness. 💫 Includes utilities for country codes, subdivisions, and regional standards management. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent geographical data handling across your application.`}
        apiItems={geoLinks}
      />
    </>
  );
};

export default GeoOverview;
