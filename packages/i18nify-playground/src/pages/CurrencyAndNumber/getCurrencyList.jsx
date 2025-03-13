import { Box } from '@razorpay/blade/components';
import { getCurrencyList } from '@razorpay/i18nify-js';
import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import CodeEditor from 'src/components/Generic/CodeEditor';
import { useMobile } from 'src/hooks/useMobile';

export default function GetCurrencyList() {
  const isMobile = useMobile();
  return (
    <Box height="100%">
      <LayoutHeader
        title="getCurrencyList"
        description={`  🌍💰 It’s your easy-peasy way to snag a whole list of currencies
            with their symbols and names. Simple, straightforward, and totally
            handy!`}
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
