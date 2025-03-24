import { formatDateTime } from '@razorpay/i18nify-js';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';
import { removeEmptyValues } from 'src/utils';

import { useI18nContext } from '@razorpay/i18nify-react';
import React from 'react';
import DatePage from 'src/pages/Date/common/DatePage';
import { useToast } from '@razorpay/blade/components';
import ErrorBoundary from 'src/components/Dashboard/ErrorBoundry';

export default function FormatDateTime() {
  const [inpValue, setInpValue] = useState(new Date());
  const [code, setCode] = useState('');
  const { intlDateOptions } = useIntlOptionsDateContext();

  const { i18nState } = useI18nContext();
  const { locale } = i18nState;
  const toast = useToast();

  useEffect(() => {
    try {
      setCode(
        formatDateTime(new Date(inpValue), {
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
    <ErrorBoundary>
      <DatePage
        utilName="formatDateTime"
        inpValue={inpValue}
        onInpChange={(val) => {
          setInpValue(dayjs(val));
        }}
        code={code}
        title="formatDateTime"
        description={`📅 Your essential utility for formatting dates and times with precision! 🌍 Features include date-time formatting with locale support and customizable output patterns. 🔄 Perfect for apps needing standardized date-time display, the function formats dates according to locale-specific patterns and user preferences. 💫 Includes support for various date-time components like year, month, day, hour, minute, and second with flexible formatting options. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent date-time formatting across your application.`}
      />
    </ErrorBoundary>
  );
}
