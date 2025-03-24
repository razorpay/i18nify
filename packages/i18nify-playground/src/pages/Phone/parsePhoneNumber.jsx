import { Box } from '@razorpay/blade/components';
import { parsePhoneNumber } from '@razorpay/i18nify-js/phoneNumber';
import React, { useState } from 'react';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import PhoneNumberForm from 'src/pages/Phone/common/PhoneNumberForm';
import { useMobile } from 'src/hooks/useMobile';
import {
  DEFAULT_PHONE_DIAL_CODE,
  DEFAULT_PHONE_NUMBER,
} from 'src/pages/Phone/common/data/phoneNumber';

export default function ParsePhoneNumber() {
  const [inpValue, setInpValue] = useState(DEFAULT_PHONE_NUMBER);

  const [dialCode, setDialCode] = useState(DEFAULT_PHONE_DIAL_CODE);
  const code = +inpValue > 5 ? parsePhoneNumber(`${dialCode}${inpValue}`) : {};
  const formattedCode = JSON.stringify(code, null, 2);

  const isMobile = useMobile();

  return (
    <>
      <LayoutHeader
        title="parsePhoneNumber"
        description={`🔍 Your essential utility for extracting phone number details with precision! 🌍 Features include comprehensive phone number parsing with locale support and country code detection. 🔄 Perfect for apps needing detailed phone number information, the function breaks down numbers into components like country code, national number, and formatting patterns. 💫 Includes support for various input formats and automatic region detection. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent phone number parsing across your application.`}
      />

      <Box display="flex" marginRight="spacing.4" flexWrap="wrap">
        <Box width="50%">
          <PhoneNumberForm
            inpValue={inpValue}
            onInpChange={(val) => setInpValue(val)}
            dialCode={dialCode}
            onDialCodeChange={(val) => setDialCode(val)}
            utilName="parsePhoneNumber"
          />
        </Box>

        <Box marginTop="spacing.4" width={isMobile ? '100%' : '50%'}>
          <CodeEditor code={formattedCode} />
        </Box>
      </Box>
    </>
  );
}
