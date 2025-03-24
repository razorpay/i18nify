import { getFlagsForAllCountries } from '@razorpay/i18nify-js/geo';

import SVG from 'react-inlinesvg';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import React from 'react';
import { Box, Text } from '@razorpay/blade/components';
import { useMobile } from 'src/hooks/useMobile';

export default function GetFlagsForAllCountries() {
  const flags = getFlagsForAllCountries();
  const code = JSON.stringify(flags, null, 2);
  const isMobile = useMobile();

  return (
    <Box>
      <LayoutHeader
        title="getFlagsForAllCountries"
        description={`🌐 Your essential utility for accessing flags of all countries in one go! 🌍 Features include comprehensive flag retrieval with country code mapping and multiple format support. 🔄 Perfect for apps needing global flag display, the function returns a complete collection of flag URLs for all supported countries. 💫 Includes both original and 4x3 aspect ratio options for each country flag. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent flag handling across your application.`}
      />

      <Box
        display="flex"
        width="100%"
        columnGap="spacing.8"
        flexWrap={isMobile ? 'wrap' : 'nowrap'}
      >
        <Box width={isMobile ? '100%' : '50%'}>
          <CodeEditor code={code} />
        </Box>

        <Box width={isMobile ? '100%' : '50%'} height="500px" overflowY="auto">
          {Object.entries(flags).map(([countryCode, countrySvg]) => {
            return (
              <Box>
                <SVG
                  src={countrySvg.original}
                  width="60%"
                  height="auto"
                  title={countryCode}
                />
                <Text>{countryCode}</Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
