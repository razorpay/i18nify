import { useState } from 'react';
import { convertToMajorUnit } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import NumberForm from 'src/sections/number/number-form';

// ----------------------------------------------------------------------

export default function ConvertToMajorUnit() {
  const [inpValue, setInpValue] = useState('');
  const [currency, setCurrency] = useState('INR');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            ConvertToMajorUnit
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            💵🔄 This function is your go-to tool for scaling currency values
            from lower to major units. Just input the amount in a minor unit
            (like cents or pence) along with the currency code, and voilà! You
            get the amount in a major unit (like dollars or pounds). And if you
            stumble upon an unsupported currency code, it'll promptly let you
            know by throwing an error.
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
                  {convertToMajorUnit(inpValue, {
                    currency,
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
          <NumberForm
            inpValue={inpValue}
            currency={currency}
            onCurrencyChange={(val) => setCurrency(val)}
            onInpChange={(val) => setInpValue(val)}
            includeIntlOptions={false}
          />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid
              sx={{ height: '30vh' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Typography variant="h2">
                  {convertToMajorUnit(inpValue, {
                    currency,
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
