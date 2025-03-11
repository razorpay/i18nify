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
  }, [inpValue, intlDateOptions]);

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
      description={`🔍🗓️ The parseDateTime function is like a time-traveler’s best
            friend, expertly navigating the complex world of dates and times.
            Whether it’s a string or a Date object you’re dealing with, this
            function seamlessly transforms it into a comprehensive,
            easy-to-digest package of date information, tailored to any locale
            you desire. 🌍⏲️`}
    />
  );
}
