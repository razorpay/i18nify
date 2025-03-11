import { formatNumberByParts } from '@razorpay/i18nify-js';

import { useIntlOptionsContext } from 'src/context/intlOptionsContext';
import { removeEmptyValues } from 'src/utils';

import { useI18nContext } from '@razorpay/i18nify-react';
import React from 'react';
import NumberPage from 'src/pages/CurrencyAndNumber/common/NumberPage';
import withNumberHOC from 'src/pages/CurrencyAndNumber/common/withNumberHOC';

function FormatNumberByParts(props) {
  const { intlOptions } = useIntlOptionsContext();
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;

  const code = JSON.stringify(
    formatNumberByParts(props.inpValue, {
      locale,
      currency: props.currency,
      intlOptions: removeEmptyValues(intlOptions),
    }),
    null,
    2,
  );

  return (
    <NumberPage
      {...props}
      title="formatNumberByParts"
      description={` This slick function breaks down numbers into separate pieces using
            Intl.NumberFormat. It&apos;s like taking apart a puzzle 🧩 —
            currency symbol here, integers there, decimals in their place—with a
            fail-proof system to handle any formatting hiccups 🥴 along the way.
            Smooth operator, right?`}
      code={code}
      isSmallEditor={false}
    />
  );
}

export default withNumberHOC(FormatNumberByParts);
