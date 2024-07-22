import { useState } from 'react';
import { formatDateTime } from '@razorpay/i18nify-js';

import dayjs from 'dayjs';
import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';

import DateForm from 'src/sections/date/date-form';
import { useI18nContext } from '@razorpay/i18nify-react';

// ----------------------------------------------------------------------

export default function FormatDate() {
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
            FormatDate
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍📆 This global time stylist effortlessly turns your dates into
            beautifully formatted strings, tailored to different locales.
            Whether you're dealing with international clients or just love the
            beauty of diverse date formats, `formatDate` is your go-to function.
            It leverages the power of the Intl.DateTimeFormat API, ensuring that
            your dates always dress to impress, no matter where they're
            displayed. 🎩🌟
          </Typography>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <Grid
              sx={{ height: '100px' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Typography variant="h2">
                  {formatDateTime(new Date(inpValue), {
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
          sx={
            !isMobile && { 'border-right': '1px solid rgba(0,0,0,0.2)', pr: 2 }
          }
        >
          <DateForm
            utilName="formatDate"
            inpValue={inpValue}
            onInpChange={(val) => {
              setInpValue(dayjs(val));
            }}
            includeIntlOptions={true}
          />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid
              sx={{ height: '60vh' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Typography variant="h2">
                  {formatDateTime(new Date(inpValue), {
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
