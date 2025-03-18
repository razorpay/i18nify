import React from 'react';

import {
  Grid,
  useTheme,
  Typography,
  OutlinedInput,
  useMediaQuery,
} from '@mui/material';

import IntlOptionsForm from 'src/components/intlOptionsForm';
import CurrencyListDropdown from 'src/components/currencyListDropdown';

const NumberForm = ({
  inpValue,
  currency,
  onInpChange,
  onCurrencyChange,
  includeIntlOptions = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Grid container rowSpacing={5} alignItems="center">
        <Grid item xs={isMobile ? 12 : 10} sx={{ mb: 2 }}>
          <OutlinedInput
            value={inpValue}
            onChange={(ev) => {
              onInpChange(ev.target.value);
            }}
            size="large"
            fullWidth
            placeholder="Enter value..."
          />
        </Grid>
        <Grid item xs={isMobile ? 5 : 4}>
          <Typography variant="h5">Choose Currency:</Typography>
        </Grid>
        <Grid item xs={isMobile ? 7 : 6}>
          <CurrencyListDropdown
            currency={currency}
            onChange={onCurrencyChange}
          />
        </Grid>
      </Grid>
      {includeIntlOptions && <IntlOptionsForm />}
    </>
  );
};
export default NumberForm;
