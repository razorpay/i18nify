import { getFlagOfCountry } from '@razorpay/i18nify-js/geo';
import { useEffect, useState } from 'react';

import SVG from 'react-inlinesvg';

import { Box } from '@razorpay/blade/components';
import React from 'react';
import CountryDropdown from 'src/components/Generic/CountryDropdown';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import { useMobile } from 'src/hooks/useMobile';

export default function GetFlagOfCountry() {
  const [inpValue, setInpValue] = useState('');
  const [countryCode, setCountryCode] = useState('US');

  const isMobile = useMobile();

  useEffect(() => {
    const data = getFlagOfCountry(countryCode);
    setInpValue(data);
  }, [countryCode]);

  return (
    <Box>
      <LayoutHeader
        title={'getFlagOfCountry'}
        description={`  🏳️‍🌈✨ Fetching country flags has never been easier! Just hand over a
            country code to this function, and it will retrieve the SVG content
            of the corresponding flag for you. Whether it's for displaying
            patriotic flair or for an international project, this function
            handles the lookup and ensures you get the exact visual
            representation of the nation's pride. In case it can't find the
            flag, it won't leave you hanging; it'll let you know something went
            wrong.`}
      />
      <Box display="flex" flexWrap="wrap" justifyContent="space-around">
        <CountryDropdown
          value={countryCode}
          onChange={(val) => setCountryCode(val)}
        />

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
