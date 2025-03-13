import React from 'react';
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { Box, Text } from '@razorpay/blade/components';
import CodeEditor from 'src/components/Generic/CodeEditor';
import IntlOptionsDateForm from 'src/components/intlOptions/IntlOptionsDateForm';

const DateForm = ({
  inpValue,
  isSmallEditor = true,
  infoMessage = null,
  isValid = true,
  onInpChange,
  code = null,
  utilName,
  includeIntlOptions = true,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap="spacing.5"
      marginRight="spacing.3"
      flexWrap="wrap"
    >
      <Box width="50%">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={dayjs(inpValue)}
            onChange={onInpChange}
            sx={{ width: '100%' }}
          />
        </LocalizationProvider>
        <Text
          color={
            isValid
              ? 'surface.text.onSea.onIntense'
              : 'feedback.text.negative.intense'
          }
          visibility={infoMessage ? 'visible' : 'hidden'}
        >
          {infoMessage}
        </Text>
      </Box>
      {!isSmallEditor ? (
        <Box display="flex" flexWrap="wrap">
          {includeIntlOptions && <IntlOptionsDateForm utilName={utilName} />}
          {code && (
            <Box marginTop="spacing.7">
              <CodeEditor code={code} isSmallEditor={isSmallEditor} />
            </Box>
          )}
        </Box>
      ) : (
        <>
          {code && <CodeEditor code={code} isSmallEditor={isSmallEditor} />}
          {includeIntlOptions && <IntlOptionsDateForm utilName={utilName} />}
        </>
      )}
    </Box>
  );
};
export default DateForm;
