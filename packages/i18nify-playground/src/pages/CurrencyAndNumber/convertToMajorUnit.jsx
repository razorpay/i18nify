import { convertToMajorUnit } from '@razorpay/i18nify-js';

import React from 'react';
import NumberPage from 'src/pages/CurrencyAndNumber/common/NumberPage';
import withNumberHOC from 'src/pages/CurrencyAndNumber/common/withNumberHOC';

function ConvertToMajorUnit(props) {
  return (
    <NumberPage
      title="convertToMajorUnit"
      description={`💹 Your essential utility for converting minor currency units to major units! 🌍 Features include precise conversion handling with locale support and decimal precision. 🔄 Perfect for apps dealing with currency calculations, the function converts minor units (like cents) to major units (like dollars) with proper decimal placement. 💫 Includes built-in validation and handling of different currency decimal places. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent currency conversion across your application.`}
      {...props}
      supportLocale={false}
      isSmallEditor
      code={convertToMajorUnit(+props.inpValue, {
        currency: props.currency,
      }).toString()}
      includeIntlOptions={false}
    />
  );
}

export default withNumberHOC(ConvertToMajorUnit);
