import { useState } from 'react';
import { getRelativeTime } from '@razorpay/i18nify-js';

import dayjs from 'dayjs';
import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';

import DateForm from 'src/sections/date/date-form';
import { useI18nContext } from '@razorpay/i18nify-react';

// ----------------------------------------------------------------------

export default function GetRelativeTime() {
  const [inpValue, setInpValue] = useState(new Date());
  const { intlDateOptions } = useIntlOptionsDateContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetRelativeTime
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            ⏳🌏 This time-traveling virtuoso effortlessly bridges the gap between dates, offering a
            glimpse into the past or a peek into the future. With the help of the
            Internationalization API (Intl), getRelativeTime transforms absolute dates into
            relatable, human-friendly phrases like ‘3 hours ago’ or ‘in 2 days’. Whether you’re
            reminiscing the past or anticipating the future, this function keeps you connected to
            time in the most intuitive way! 🚀🕰️
          </Typography>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <Grid sx={{ height: '100px' }} container alignItems="center" justifyContent="center">
              <Grid item>
                <Typography variant="h2">
                  {getRelativeTime(new Date(inpValue), new Date(), {
                    locale,
                    intlOptions: removeEmptyValues(intlDateOptions),
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid
          item
          xs={isMobile ? 12 : 7}
          sx={!isMobile && { 'border-right': '1px solid rgba(0,0,0,0.2)', pr: 2 }}
        >
          <DateForm
            utilName="getRelativeTime"
            inpValue={inpValue}
            onInpChange={(val) => {
              setInpValue(dayjs(val));
            }}
            includeIntlOptions={true}
          />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid sx={{ height: '30vh' }} container alignItems="center" justifyContent="center">
              <Grid item>
                <Typography variant="h3">
                  {getRelativeTime(new Date(inpValue), new Date(), {
                    locale,
                    intlOptions: removeEmptyValues(intlDateOptions),
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
