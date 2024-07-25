import { useState } from 'react';
import { formatNumberByParts } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import { removeEmptyValues } from 'src/utils';
import { useIntlOptionsContext } from 'src/context/intlOptionsContext';

import NumberForm from 'src/sections/number/number-form';
import { useI18nContext } from '@razorpay/i18nify-react';
import CodeEditor from 'src/components/codeEditor';

// ----------------------------------------------------------------------

export default function NumberView() {
  const [currency, setCurrency] = useState('');
  const [inpValue, setInpValue] = useState('');
  const { intlOptions } = useIntlOptionsContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { i18nState } = useI18nContext();
  const { locale } = i18nState;

  const code = JSON.stringify(
    formatNumberByParts(inpValue, {
      locale,
      currency,
      intlOptions: removeEmptyValues(intlOptions),
    }),
    null,
    2,
  );

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            FormatNumberByParts
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            This slick function breaks down numbers into separate pieces using
            Intl.NumberFormat. It&apos;s like taking apart a puzzle 🧩 —
            currency symbol here, integers there, decimals in their place—with a
            fail-proof system to handle any formatting hiccups 🥴 along the way.
            Smooth operator, right?
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
          <NumberForm
            inpValue={inpValue}
            currency={currency}
            onCurrencyChange={(val) => setCurrency(val)}
            onInpChange={(val) => setInpValue(val)}
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
