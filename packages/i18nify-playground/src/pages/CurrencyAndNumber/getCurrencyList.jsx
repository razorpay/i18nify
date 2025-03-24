import { Box } from '@razorpay/blade/components';
import { getCurrencyList } from '@razorpay/i18nify-js';
import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import { useMobile } from 'src/hooks/useMobile';

export default function GetCurrencyList() {
  const isMobile = useMobile();
  return (
    <Box height="100%">
      <LayoutHeader
        title="getCurrencyList"
        description={`📋 Your essential utility for retrieving comprehensive currency information! 🌍 Features include accessing currency metadata, symbols, and configuration details with locale support. 🔄 Perfect for apps needing currency reference data, the function returns a complete list of supported currencies with their properties. 💫 Includes detailed information like currency names, symbols, and minor unit configurations based on international standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent currency data access across your application.`}
      />

      <Box display="grid" flexWrap="wrap" width="100%">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={isMobile ? '100%' : '500px'}
        >
          <CodeEditor code={JSON.stringify(getCurrencyList(), null, 2)} />
        </Box>
      </Box>
    </Box>
  );
}
