import { getDialCodeByCountryCode } from '@razorpay/i18nify-js';
import { useState } from 'react';

import { Box, Text } from '@razorpay/blade/components';
import React from 'react';
import CountryDropdown from 'src/components/Generic/CountryDropdown';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';

export default function GetDialCodeByCountryCode() {
  const [countryCode, setCountryCode] = useState('US');

  return (
    <>
      <LayoutHeader
        title="getDialCodeByCountryCode"
        description={`  📞🗺️ This function is your quick access to finding the dial code for
            any specific country, utilizing the country's ISO code. Perfect for
            applications that require validating user input for phone numbers or
            enhancing UIs with country-specific details. It ensures you get the
            exact dial code you need, and if the country code doesn't match, it
            alerts you right away with an error.`}
      />
      <Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box>
            <Text>{getDialCodeByCountryCode(countryCode)}</Text>
          </Box>
        </Box>
        <CountryDropdown
          value={countryCode}
          onChange={(val) => setCountryCode(val)}
        />
      </Box>
    </>
  );
}
