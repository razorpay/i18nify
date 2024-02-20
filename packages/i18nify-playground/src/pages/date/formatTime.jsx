import { useState } from 'react';
import { formatTime } from '@razorpay/i18nify-js';

import dayjs from 'dayjs';
import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';

import DateForm from 'src/sections/date/date-form';
import { useI18nContext } from '@razorpay/i18nify-react';

// ----------------------------------------------------------------------

export default function FormatTime() {
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
            FormatTime
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            ⏰🌐 This timely charmer is your key to unlocking the secrets of time presentation
            across different cultures. Using the wizardry of the Internationalization API (Intl),
            formatTime translates your time into a format that resonates with local customs and
            practices. Whether it’s for scheduling international calls or just making sure you’re in
            sync with the world’s timezones, this function is your trusty sidekick in the realm of
            time formatting! 🌟⌚
          </Typography>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <Grid sx={{ height: '100px' }} container alignItems="center" justifyContent="center">
              <Grid item>
                <Typography variant="h2">
                  {formatTime(new Date(inpValue), {
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
            utilName="formatTime"
            inpValue={inpValue}
            onInpChange={(val) => {
              setInpValue(dayjs(val));
            }}
            includeIntlOptions={true}
          />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid sx={{ height: '60vh' }} container alignItems="center" justifyContent="center">
              <Grid item>
                <Typography variant="h2">
                  {formatTime(new Date(inpValue), {
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
