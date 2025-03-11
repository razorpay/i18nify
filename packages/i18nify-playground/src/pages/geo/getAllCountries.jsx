import { Box } from '@razorpay/blade/components';
import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import Loader from 'src/components/Dashboard/Loader';
import CodeEditor from 'src/components/Generic/CodeEditor';
import GenericDropdown from 'src/components/Generic/GenericDropdown';
import useCountriesList from 'src/pages/Geo/common/useCountriesList';

export default function GetAllCountries() {
  const { isPending, countryList, code, setCountryInp, countryInp } =
    useCountriesList();

  return (
    <>
      <LayoutHeader
        title="getAllCountries"
        description={` 🌍 Ready to dive into the world of nations? Say hello to
            getAllCountries! This dynamic function is your gateway to a
            comprehensive list of countries spanning the globe. With just a
            simple call, you'll unlock a treasure trove of international data,
            perfect for any coding adventurer. 🗺️🚀`}
      />

      <GenericDropdown
        label="Country List"
        list={countryList}
        value={countryInp}
        onChange={(country) => setCountryInp(country)}
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginTop="spacing.7"
      >
        <CodeEditor code={code} />
      </Box>
      {isPending && <Loader />}
    </>
  );
}
