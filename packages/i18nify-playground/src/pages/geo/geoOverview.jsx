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
        description={`Welcome to the Geo Package 🚀, your all-in-one, supercharged toolkit for sprinkling some
            geographical magic 🧙‍♂️ into your applications! Whether you're looking to jazz up your UI
            with some snazzy SVG flags 🏁, or you need the nitty-gritty details of continents,
            countries, states, cities, and zip codes, we've got you covered!`}
        apiItems={geoLinks}
      />
    </>
  );
};

export default GeoOverview;
