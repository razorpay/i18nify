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
        description={`🕰️🌍 This savvy time tailor is your go-to for dressing up dates and
            times in locale-specific styles. Whether you’re marking milestones,
            scheduling global meetings, or just need that perfect date-time
            format, formatDateTime uses the Internationalization API (Intl) to
            translate your dates and times into the local lingo. It’s like
            having a linguistic time machine at your fingertips! 🌟🗓️`}
      />
    </ErrorBoundary>
  );
}
