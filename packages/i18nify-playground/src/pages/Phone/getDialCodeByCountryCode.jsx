import { getDialCodeByCountryCode } from '@razorpay/i18nify-js';
import { useState } from 'react';

import { Box, Text } from '@razorpay/blade/components';
import React from 'react';
import CountryDropdown from 'src/components/Generic/CountryDropdown';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import { DEFAULT_COUNTRY_CODE } from 'src/components/Dashboard/constants/common';

export default function GetDialCodeByCountryCode() {
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);

  return (
    <>
      <LayoutHeader
        title="getDialCodeByCountryCode"
        description={`📞🌍 Your essential utility for retrieving country-specific dial codes! 🔄 Features include dial code lookup with country code validation and formatting. 💫 Perfect for apps needing international phone number handling, the function returns the exact dial code for any supported country code. 🚀 Includes built-in validation to ensure country codes are valid and supported. ✨ Seamlessly integrates with the i18nify ecosystem for consistent dial code handling across your application.`}
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
