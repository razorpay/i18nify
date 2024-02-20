import { useState } from 'react';
import { formatNumber } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsContext } from 'src/context/intlOptionsContext';
import NumberForm from 'src/sections/number/number-form';
import { useI18nContext } from '@razorpay/i18nify-react';

// ----------------------------------------------------------------------

export default function NumberView() {
  const [currency, setCurrency] = useState('');
  const [inpValue, setInpValue] = useState('');
  const { intlOptions } = useIntlOptionsContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            FormatNumber
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🎩✨ This little wizard helps you jazz up numerical values in all sorts of fancy ways.
            And guess what? It uses the Internationalization API (Intl) to sprinkle that magic dust
            and give you snazzy, locale-specific number formats—especially for currencies! 🌟💸
          </Typography>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <Grid sx={{ height: '100px' }} container alignItems="center" justifyContent="center">
              <Grid item>
                <Typography variant="h2">
                  {formatNumber(inpValue, {
                    locale,
                    currency,
                    intlOptions: removeEmptyValues(intlOptions),
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
          <NumberForm
            inpValue={inpValue}
            currency={currency}
            onCurrencyChange={(val) => setCurrency(val)}
            onInpChange={(val) => setInpValue(val)}
          />
        </Grid>
        {!isMobile && (
          <Grid item xs={5}>
            <Grid sx={{ height: '60vh' }} container alignItems="center" justifyContent="center">
              <Grid item>
                <Typography variant="h2">
                  {formatNumber(inpValue, {
                    locale,
                    currency,
                    intlOptions: removeEmptyValues(intlOptions),
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
