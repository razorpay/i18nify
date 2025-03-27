import { Box } from '@razorpay/blade/components';
import { getDialCodes } from '@razorpay/i18nify-js';
import React from 'react';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';

export default function GetDialCodes() {
  return (
    <>
      <LayoutHeader
        title="getDialCodes"
        description={`📞 Your essential utility for accessing international dial codes! 🌍 Features include comprehensive dial code lookup with country code mapping and validation. 🔄 Perfect for apps needing international phone number handling, the function provides a complete directory of dial codes mapped to their respective countries. 💫 Includes support for various country code formats and automatic validation. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent dial code handling across your application.`}
      />

      <Box display="flex" alignItems="center" justifyContent="center">
        <CodeEditor code={JSON.stringify(getDialCodes(), null, 2)} />
      </Box>
    </>
  );
}
