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
        description={`📱 Your essential utility for validating phone numbers across the globe! 🌍 Features include phone number validation with locale support and country code detection. 🔄 Perfect for apps needing robust phone number verification, the function validates numbers against country-specific patterns. 💫 Includes support for various phone number formats and automatic country detection from international numbers. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent phone number validation across your application.`}
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
