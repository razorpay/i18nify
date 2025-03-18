import { useState } from 'react';
import { getCurrencySymbol } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

import CurrencyListDropdown from 'src/components/currencyListDropdown';

// ----------------------------------------------------------------------

export default function GetCurrencySymbol() {
  const [currency, setCurrency] = useState('INR');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetCurrencySymbol
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            Picture this: it&apos;s like having a cool decoder ring for currency
            codes! 🔍💰 This little guy, grabs the symbol for a currency code
            from its secret stash.
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
                {getCurrencySymbol(currency)}
              </Typography>
            </Grid>
          </Grid>
          <CurrencyListDropdown
            currency={currency}
            onChange={(val) => setCurrency(val)}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
