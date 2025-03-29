import { formatNumberByParts } from '@razorpay/i18nify-js';

import { useIntlOptionsContext } from 'src/context/intlOptionsContext';
import { removeEmptyValues } from 'src/utils';

import { useI18nContext } from '@razorpay/i18nify-react';
import React, { useEffect, useState } from 'react';
import NumberPage from 'src/pages/CurrencyAndNumber/common/NumberPage';
import withNumberHOC from 'src/pages/CurrencyAndNumber/common/withNumberHOC';
import { useToast } from '@razorpay/blade/components';

function FormatNumberByParts(props) {
  const [code, setCode] = useState('');

  const { intlOptions } = useIntlOptionsContext();
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;

  const toast = useToast();

  useEffect(() => {
    try {
      const value = JSON.stringify(
        formatNumberByParts(props.inpValue, {
          locale,
          currency: props.currency,
          intlOptions: removeEmptyValues(intlOptions),
        }),
        null,
        2,
      );
      setCode(value);
    } catch (error) {
      toast.show({
        content: error.message || 'An error occurred',
        color: 'negative',
      });
    }
  }, [locale, props, intlOptions]);

  return (
    <NumberPage
      {...props}
      title="formatNumberByParts"
      description={`🔢 Your powerful utility for breaking down formatted numbers into parts! 🌍 Features include number formatting with locale support, currency symbol handling, and decimal placement with detailed part information. 🔄 Perfect for apps needing granular control over number display, the function returns structured data about integers, decimals, currency symbols, and their positions. 💫 Includes utilities for currency symbol placement detection and grouping based on regional standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent number formatting across your application.`}
      code={code}
      isSmallEditor={false}
    />
  );
}

export default withNumberHOC(FormatNumberByParts);
