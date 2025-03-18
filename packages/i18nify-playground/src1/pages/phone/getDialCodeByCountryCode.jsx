import { useEffect, useState } from 'react';
import {
  getAllCountries,
  getDialCodeByCountryCode,
} from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

import CountryDropdown from 'src/components/countryDropdown';

// ----------------------------------------------------------------------

export default function GetDialCodeByCountryCode() {
  const [countryCode, setCountryCode] = useState('US');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            getDialCodeByCountryCode
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            📞🗺️ This function is your quick access to finding the dial code for
            any specific country, utilizing the country's ISO code. Perfect for
            applications that require validating user input for phone numbers or
            enhancing UIs with country-specific details. It ensures you get the
            exact dial code you need, and if the country code doesn't match, it
            alerts you right away with an error.
          </Typography>
        </Grid>

        <Grid item xs={isMobile ? 12 : 4}>
          <Grid
            sx={{ height: '100px' }}
            container
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Typography variant="h2">
                {getDialCodeByCountryCode(countryCode)}
              </Typography>
            </Grid>
          </Grid>
          <CountryDropdown
            value={countryCode}
            onChange={(val) => setCountryCode(val)}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
