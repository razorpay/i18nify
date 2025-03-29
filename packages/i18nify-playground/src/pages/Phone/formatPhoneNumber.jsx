import { formatPhoneNumber } from '@razorpay/i18nify-js/phoneNumber';
import { useState } from 'react';

import { Box } from '@razorpay/blade/components';
import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import TextEditorForStrings from 'src/components/TextEditorForStrings/TextEditorForStrings';
import PhoneNumberForm from 'src/pages/Phone/common/PhoneNumberForm';
import {
  DEFAULT_PHONE_DIAL_CODE,
  DEFAULT_PHONE_NUMBER,
} from 'src/pages/Phone/common/data/phoneNumber';

export default function IsValidPhoneNumberView() {
  const [inpValue, setInpValue] = useState(DEFAULT_PHONE_NUMBER);
  const [dialCode, setDialCode] = useState(DEFAULT_PHONE_DIAL_CODE);

  const forMattedPhoneNumber =
    +inpValue > 5 ? formatPhoneNumber(`${dialCode}${inpValue}`) : null;

  return (
    <>
      <LayoutHeader
        title="formatPhoneNumber"
        description="📞 Your essential utility for formatting phone numbers with precision! 🌍 Features include phone number formatting with locale support and country code detection. 🔄 Perfect for apps needing standardized phone number display, the function formats numbers according to country-specific patterns. 💫 Includes support for various input formats and automatic country code handling. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent phone number formatting across your application."
      />

      <PhoneNumberForm
        inpValue={inpValue}
        dialCode={dialCode}
        onInpChange={(val) => setInpValue(val)}
        onDialCodeChange={(val) => setDialCode(val)}
        utilName="formatPhoneNumber"
      />

      <Box marginTop="spacing.4">
        <TextEditorForStrings value={forMattedPhoneNumber ?? '-'} />
      </Box>
    </>
  );
}
