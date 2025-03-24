import { getFlagOfCountry } from '@razorpay/i18nify-js/geo';
import { useEffect, useState } from 'react';

import SVG from 'react-inlinesvg';

import { Box } from '@razorpay/blade/components';
import React from 'react';
import CountryDropdown from 'src/components/Generic/CountryDropdown';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import { useMobile } from 'src/hooks/useMobile';
import { DEFAULT_COUNTRY_CODE } from 'src/components/Dashboard/constants/common';

export default function GetFlagOfCountry() {
  const [inpValue, setInpValue] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);

  const isMobile = useMobile();

  useEffect(() => {
    const data = getFlagOfCountry(countryCode);
    setInpValue(data);
  }, [countryCode]);

  return (
    <Box>
      <LayoutHeader
        title={'getFlagOfCountry'}
        description={`🏁 Your essential utility for retrieving country flags with precision! 🌍 Features include flag retrieval with country code validation and multiple format support. 🔄 Perfect for apps needing national flag display, the function returns flag URLs in both original and 4x3 aspect ratios. 💫 Includes built-in validation to ensure country codes are valid and supported. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent flag handling across your application.`}
      />
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <Box width="300px">
          <CountryDropdown
            value={countryCode}
            onChange={(val) => setCountryCode(val)}
          />
        </Box>

        <Box
          display="flex"
          width="30%"
          flexDirection="column"
          marginTop={isMobile ? 'spacing.4' : 'spacing.0'}
        >
          <img src={inpValue?.original} width="100%" title={countryCode} />

          <Box>
            <p>Aspect ratio 4X3</p>
            <img src={inpValue?.['4X3']} width="100%" title={countryCode} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
