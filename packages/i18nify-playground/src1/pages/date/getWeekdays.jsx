import { getWeekdays } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsDateContext } from 'src/context/intlOptionsDateContext';

import IntlOptionsDateForm from 'src/components/intlOptionsDateForm';
import { useI18nContext } from '@razorpay/i18nify-react';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';

// ----------------------------------------------------------------------

export default function GetWeekdays() {
  const { intlDateOptions } = useIntlOptionsDateContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetWeekdays
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            📅🌐 This global day-namer is your trusty guide through the week, no
            matter where you are in the world. Using the power of the
            Internationalization API (Intl), getWeekdays serves up the names of
            all seven days tailored to your chosen locale. From planning
            international meetings to creating a multilingual planner, this
            function provides the perfect blend of cultural awareness and
            practical utility, keeping you in sync with the local rhythm of
            life, one day at a time! 🌟🗓️
          </Typography>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <Grid
              sx={{ height: '200px' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                item
                sx={{ height: '200px', width: '100%', padding: '20px 0px' }}
              >
                <CodeEditor value={code} />
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
          <IntlOptionsDateForm utilName="getWeekdays" />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid
              sx={{ height: '60vh' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                item
                sx={{ height: '100%', width: '100%', padding: '0px 20px' }}
              >
                <CodeEditor value={code} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
