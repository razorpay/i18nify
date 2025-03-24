import { parseDateTime } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';
import { removeEmptyValues } from 'src/utils';

import { useI18nContext } from '@razorpay/i18nify-react';
import React from 'react';
import DatePage from 'src/pages/Date/common/DatePage';
import { useToast } from '@razorpay/blade/components';

export default function ParseDateTime() {
  const [inpValue, setInpValue] = useState(new Date());
  const [code, setCode] = useState('');

  const { intlDateOptions } = useIntlOptionsDateContext();
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;

  const toast = useToast();

  useEffect(() => {
    try {
      setCode(
        JSON.stringify(
          parseDateTime(new Date(inpValue), {
            locale,
            intlOptions: removeEmptyValues(intlDateOptions),
          }),
          null,
          2,
        ),
      );
    } catch (error) {
      toast.show({
        content: error.message || 'An error occurred',
        color: 'negative',
      });
    }
  }, [inpValue, intlDateOptions, locale]);

  return (
    <DatePage
      utilName="parseDateTime"
      inpValue={inpValue}
      isSmallEditor={false}
      onInpChange={(val) => {
        setInpValue(dayjs(val));
      }}
      code={code}
      title="parseDateTime"
      description={`🔍 Your essential utility for breaking down dates into detailed components! 🌍 Features include date parsing with locale support and customizable output formats. 🔄 Perfect for apps needing granular date information, the function transforms dates into structured data with timezone awareness. 💫 Includes support for various date components and formatting patterns based on regional standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent date parsing across your application.`}
    />
  );
}
