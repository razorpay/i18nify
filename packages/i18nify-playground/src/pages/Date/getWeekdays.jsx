import { getWeekdays } from '@razorpay/i18nify-js';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';

import { useI18nContext } from '@razorpay/i18nify-react';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import React, { useEffect, useState } from 'react';
import { Box } from '@razorpay/blade/components';
import IntlOptionsDateForm from 'src/components/intlOptions/IntlOptionsDateForm';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import {
  getDateTimeSupportedLocals,
  getSupportedLocalsObjectStructure,
} from 'src/components/LocalDropdown/utils';

export default function GetWeekdays() {
  const { intlDateOptions } = useIntlOptionsDateContext();
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;
  const [code, setCode] = useState('');

  useEffect(() => {
    setCode(
      JSON.stringify(
        getWeekdays({
          locale,
          weekday: removeEmptyValues(intlDateOptions).weekday,
        }),
        null,
        2,
      ),
    );
  }, [locale, intlDateOptions]);

  return (
    <Box>
      <LayoutHeader
        showLocalDropdown
        supportedLocals={getSupportedLocalsObjectStructure(
          getDateTimeSupportedLocals(),
        )}
        title="getWeekdays"
        description={`📅🌐 Your essential utility for accessing weekday names across cultures! 🌍 Features include weekday name retrieval with locale support and customizable formatting. 🔄 Perfect for apps needing localized day names, the function returns weekday names according to locale-specific patterns and preferences. 💫 Includes support for various formatting options like long, short, or narrow weekday names. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent weekday handling across your application.`}
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
