import { isValidPhoneNumber } from '@razorpay/i18nify-js/phoneNumber';
import { useState } from 'react';

import React from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import {
  DEFAULT_PHONE_DIAL_CODE,
  DEFAULT_PHONE_NUMBER,
} from 'src/pages/Phone/common/data/phoneNumber';
import PhoneNumberForm from 'src/pages/Phone/common/PhoneNumberForm';

export default function IsValidPhoneNumberView() {
  const [inpValue, setInpValue] = useState(DEFAULT_PHONE_NUMBER);
  const [dialCode, setDialCode] = useState(DEFAULT_PHONE_DIAL_CODE);

  const phoneNumber = inpValue.replaceAll(' ').replaceAll('-');
  const isValid = isValidPhoneNumber(`${dialCode}${phoneNumber}`);
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
