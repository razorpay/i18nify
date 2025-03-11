import React, { useState } from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import CountryDropdown from 'src/components/Generic/CountryDropdown';

const GetListOfBanks = () => {
  const [countryCode, setCountryCode] = useState('IN');

  return (
    <>
      <LayoutHeader title={'getListOfBanks'} description={'getListOfBanks'} />
      <CountryDropdown value={countryCode} onChange={setCountryCode} />
    </>
  );
};

export default GetListOfBanks;
