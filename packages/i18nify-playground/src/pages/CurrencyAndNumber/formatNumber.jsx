import { useToast } from '@razorpay/blade/components';
import { formatNumber } from '@razorpay/i18nify-js';
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
      const value = formatNumber(+props.inpValue, {
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
      description="🎩✨ This little wizard helps you jazz up numerical values in all
      sorts of fancy ways. And guess what? It uses the
      Internationalization API (Intl) to sprinkle that magic dust and give
      you snazzy, locale-specific number formats—especially for
      currencies! 🌟💸"
      isSmallEditor
      code={code}
    />
  );
}

export default withNumberHOC(FormatNumber);
