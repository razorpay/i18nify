import { convertToMinorUnit } from '@razorpay/i18nify-js';
import React from 'react';
import NumberPage from 'src/pages/CurrencyAndNumber/common/NumberPage';
import withNumberHOC from 'src/pages/CurrencyAndNumber/common/withNumberHOC';

function ConvertToMinorUnit(props) {
  return (
    <NumberPage
      title="convertToMinorUnit"
      description={`= 💵🔄 This function is your go-to tool for scaling currency values
            from lower to major units. Just input the amount in a minor unit
            (like cents or pence) along with the currency code, and voilà! You
            get the amount in a major unit (like dollars or pounds). And if you
            stumble upon an unsupported currency code, it'll promptly let you
            know by throwing an error`}
      {...props}
      isSmallEditor
      code={convertToMinorUnit(+props.inpValue, {
        currency: props.currency,
      }).toString()}
      includeIntlOptions={false}
    />
  );
}

export default withNumberHOC(ConvertToMinorUnit);
