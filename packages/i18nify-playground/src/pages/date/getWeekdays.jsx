import { getWeekdays } from '@razorpay/i18nify-js';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';

import { useI18nContext } from '@razorpay/i18nify-react';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import React from 'react';
import { Box } from '@razorpay/blade/components';
import IntlOptionsDateForm from 'src/components/intlOptions/IntlOptionsDateForm';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';

export default function GetWeekdays() {
  const { intlDateOptions } = useIntlOptionsDateContext();
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;

  const code = JSON.stringify(
    getWeekdays({
      locale,
      weekday: removeEmptyValues(intlDateOptions).weekday,
    }),
    null,
    2,
  );

  return (
    <Box>
      <LayoutHeader
        title="getWeekdays"
        description={`📅🌐 This global day-namer is your trusty guide through the week, no
            matter where you are in the world. Using the power of the
            Internationalization API (Intl), getWeekdays serves up the names of
            all seven days tailored to your chosen locale. From planning
            international meetings to creating a multilingual planner, this
            function provides the perfect blend of cultural awareness and
            practical utility, keeping you in sync with the local rhythm of
            life, one day at a time! 🌟🗓️`}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        rowGap="spacing.3"
        flexWrap="wrap"
      >
        <IntlOptionsDateForm utilName="getWeekdays" />

        <CodeEditor code={code} />
      </Box>
    </Box>
  );
}
