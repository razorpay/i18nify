import React from 'react';
import dayjs from 'dayjs';

import { Grid, useTheme, useMediaQuery, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import IntlOptionsDateForm from 'src/components/intlOptionsDateForm';

const DateForm = ({
  inpValue,
  infoMessage = null,
  isValid = true,
  onInpChange,
  utilName,
  includeIntlOptions = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Grid container rowSpacing={5} alignItems="center">
        <Grid item xs={isMobile ? 12 : 10} sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker value={dayjs(inpValue)} onChange={onInpChange} sx={{width: '100%'}} />
          </LocalizationProvider>
          <Typography
            marginTop={1}
            variant="caption"
            display="block"
            gutterBottom
            sx={{
              visibility: infoMessage ? 'visible' : 'hidden',
              color: isValid ? 'green' : 'red',
            }}
          >
            {infoMessage}
          </Typography>
        </Grid>
      </Grid>
      {includeIntlOptions && <IntlOptionsDateForm utilName={utilName} />}
    </>
  );
};
export default DateForm;
