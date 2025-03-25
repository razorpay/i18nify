import { convertToMinorUnit } from '@razorpay/i18nify-js';
import React from 'react';
import NumberPage from 'src/pages/CurrencyAndNumber/common/NumberPage';
import withNumberHOC from 'src/pages/CurrencyAndNumber/common/withNumberHOC';

function ConvertToMinorUnit(props) {
  return (
    <NumberPage
      title="convertToMinorUnit"
      description={`💸 Your essential utility for converting major currency units to minor units! 🌍 Features include precise conversion handling with locale support and decimal precision. 🔄 Perfect for apps dealing with currency calculations, the function converts major units (like dollars) to minor units (like cents) with proper decimal placement. 💫 Includes built-in validation and handling of different currency decimal places. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent currency conversion across your application.`}
      {...props}
      isSmallEditor
      code={convertToMinorUnit(+props.inpValue, {
        currency: props.currency,
      }).toString()}
      supportLocale={false}
      includeIntlOptions={false}
    />
  );
}

export default withNumberHOC(ConvertToMinorUnit);
