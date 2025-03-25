import { getRelativeTime } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';
import { removeEmptyValues } from 'src/utils';

import { useI18nContext } from '@razorpay/i18nify-react';
import React from 'react';
import DatePage from 'src/pages/Date/common/DatePage';
import { useToast } from '@razorpay/blade/components';

export default function GetRelativeTime() {
  const [inpValue, setInpValue] = useState(new Date());
  const [code, setCode] = useState();
  const { intlDateOptions } = useIntlOptionsDateContext();

  const { i18nState } = useI18nContext();
  const { locale } = i18nState;
  const toast = useToast();

  useEffect(() => {
    try {
      setCode(
        getRelativeTime(new Date(inpValue), new Date(), {
          locale,
          intlOptions: removeEmptyValues(intlDateOptions),
        }),
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
      utilName="getRelativeTime"
      onInpChange={(val) => {
        setInpValue(dayjs(val));
      }}
      inpValue={inpValue}
      code={code}
      title="getRelativeTime"
      description={`⏳ Your essential utility for transforming dates into human-friendly relative expressions! 🌍 Features include relative time calculation with locale support and customizable formatting. 🔄 Perfect for apps needing intuitive time displays, the function converts dates into phrases like '3 hours ago' or 'in 2 days'. 💫 Includes support for various time units from seconds to years with automatic unit selection. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent relative time handling across your application.`}
    />
  );
}
