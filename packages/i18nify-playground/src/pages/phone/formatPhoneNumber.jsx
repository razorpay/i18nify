import { formatPhoneNumber } from '@razorpay/i18nify-js/phoneNumber';
import { useState } from 'react';

import { Box } from '@razorpay/blade/components';
import React from 'react';
import CodeEditor from 'src/components/Generic/CodeEditor';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import PhoneNumberForm from 'src/pages/Phone/common/PhoneNumberForm';

export default function IsValidPhoneNumberView() {
  const [inpValue, setInpValue] = useState('');
  const [dialCode, setDialCode] = useState('+91');

  const forMattedPhoneNumber =
    +inpValue > 5 ? formatPhoneNumber(`${dialCode}${inpValue}`) : null;

  return (
    <>
      <LayoutHeader
        title="formatPhoneNumber"
        description="📞 It’s like your personal phone number stylist, working its magic
            to make those digits look all snazzy. You can tell it the country
            code, or it’ll figure it out itself—then presto! It hands you back a
            phone number looking sharp and dapper in that country’s typical
            style. ✨🌍"
      />

      <PhoneNumberForm
        inpValue={inpValue}
        dialCode={dialCode}
        onInpChange={(val) => setInpValue(val)}
        onDialCodeChange={(val) => setDialCode(val)}
        utilName="formatPhoneNumber"
      />

      <Box marginTop="spacing.4">
        <CodeEditor code={forMattedPhoneNumber ?? '-'} isSmallEditor />
      </Box>
    </>
  );
}
