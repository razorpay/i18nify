import { useToast } from '@razorpay/blade/components';
import { formatNumber } from '@razorpay/i18nify-js/currency';
import { useI18nContext } from '@razorpay/i18nify-react';
import React, { useEffect, useState } from 'react';
import { useIntlOptionsContext } from 'src/context/intlOptionsContext';
import NumberPage from 'src/pages/CurrencyAndNumber/common/NumberPage';
import withNumberHOC from 'src/pages/CurrencyAndNumber/common/withNumberHOC';
import { removeEmptyValues } from 'src/utils';

function FormatNumber(props) {
  const [code, setCode] = useState('');

  const { intlOptions } = useIntlOptionsContext();
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;
  const toast = useToast();

  useEffect(() => {
    try {
      const value = formatNumber(props.inpValue, {
        locale,
        currency: props.currency,
        intlOptions: removeEmptyValues(intlOptions),
      });
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
      title="formatNumber"
      description="🔢 Your powerful utility for formatting numbers with precision! 🌍 Features include number formatting with locale support, currency symbol handling, and decimal placement. 🔄 Perfect for apps dealing with financial data, the function handles number validations, grouping separators, and decimal formatting with built-in locale awareness. 💫 Includes utilities for currency symbol placement, decimal precision, and grouping based on regional standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent number formatting across your application."
      isSmallEditor
      code={code}
    />
  );
}

export default withNumberHOC(FormatNumber);
