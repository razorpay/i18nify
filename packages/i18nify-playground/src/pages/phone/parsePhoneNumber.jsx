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
        description={` 🕵️‍♂️📞 This clever function digs deep into a phone number, pulling out
            all the juicy details: country code, dial code, the number all
            dolled up, and even the format it follows. What’s cool? It hands you
            back an object filled with all these deets, making it a breeze to
            access everything about that phone number. It’s like having the
            ultimate phone number cheat sheet! 🌟`}
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
