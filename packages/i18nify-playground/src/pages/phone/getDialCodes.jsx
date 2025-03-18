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
        description={` 🌍🔢 This function is a comprehensive directory of international
            dial codes, mapped to their respective country codes. Whether you're
            coding a global application or just need to reference international
            dialing formats, this function provides a quick and accurate
            reference, organizing the world's dial codes in a clean, easy-to-use
            format.`}
      />

      <Box display="flex" alignItems="center" justifyContent="center">
        <CodeEditor code={JSON.stringify(getDialCodes(), null, 2)} />
      </Box>
    </>
  );
}
