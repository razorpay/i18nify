import { Box } from '@razorpay/blade/components';
import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import Loader from 'src/components/Dashboard/Loader';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import GenericDropdown from 'src/components/Generic/GenericDropdown';
import useCountriesList from 'src/pages/Geo/common/useCountriesList';

export default function GetAllCountries() {
  const { isPending, countryList, code, setCountryInp, countryInp } =
    useCountriesList();

  return (
    <>
      <LayoutHeader
        title="getAllCountries"
        description={`🌍 Your essential utility for accessing comprehensive country information! 🗺️ Features include country data retrieval with locale support and detailed metadata. 🔄 Perfect for apps needing global country information, the function returns a complete list of countries with their properties. 💫 Includes detailed information like country codes, names, and regional configurations based on international standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent country data access across your application.`}
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
