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
  }, [inpValue, intlDateOptions]);

  return (
    <DatePage
      utilName="getRelativeTime"
      onInpChange={(val) => {
        setInpValue(dayjs(val));
      }}
      inpValue={inpValue}
      code={code}
      title="getRelativeTime"
      description={`⏳🌏 This time-traveling virtuoso effortlessly bridges the gap
            between dates, offering a glimpse into the past or a peek into the
            future. With the help of the Internationalization API (Intl),
            getRelativeTime transforms absolute dates into relatable,
            human-friendly phrases like ‘3 hours ago’ or ‘in 2 days’. Whether
            you’re reminiscing the past or anticipating the future, this
            function keeps you connected to time in the most intuitive way! 🚀🕰️`}
    />
  );
}
