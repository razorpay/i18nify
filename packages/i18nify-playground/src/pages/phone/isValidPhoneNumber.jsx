import { Box } from '@razorpay/blade/components';
import { isValidPhoneNumber } from '@razorpay/i18nify-js';
import { useState } from 'react';

import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import PhoneNumberForm from 'src/pages/Phone/common/PhoneNumberForm';

export default function IsValidPhoneNumberView() {
  const [inpValue, setInpValue] = useState('');
  const [dialCode, setDialCode] = useState('+91');
  const [countryCode, setCountryCode] = useState('');

  const phoneNumber = inpValue.replaceAll(' ').replaceAll('-');
  const isValid = isValidPhoneNumber(`${dialCode}${phoneNumber}`, countryCode);
  const errorMessage = isValid ? 'Valid phone number' : 'Invalid Phone Number';

  return (
    <>
      <LayoutHeader
        title="isValidPhoneNumber"
        description={`📞 It’s like the phone number detective, using fancy patterns to
            check if a number is the real deal for a specific country code. So,
            it’s pretty simple: if it says true, your number’s good to go for
            that country; if it’s false, time to double-check those digits! 🕵️‍♂️🔍`}
      />

      <PhoneNumberForm
        inpValue={inpValue}
        onInpChange={(val) => setInpValue(val)}
        dialCode={dialCode}
        onDialCodeChange={(val) => setDialCode(val)}
        errorMessage={errorMessage}
        isValid={isValid}
        utilName="isValidPhoneNumber"
      />
    </>
  );
}
