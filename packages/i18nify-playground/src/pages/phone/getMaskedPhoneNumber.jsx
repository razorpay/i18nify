import { useState } from 'react';
import { getMaskedPhoneNumber } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import {
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import CountryDropdown from 'src/components/countryDropdown';
import PhoneMaskingOptions from 'src/components/phoneMaskingOptions';
import { PHONE_MASKING_INPUTS } from 'src/constants/phoneNumber';

// ----------------------------------------------------------------------

const INITIAL_STATE = PHONE_MASKING_INPUTS.reduce((acc, curr) => {
  acc[curr.key] = curr.defaultValue || '';
  return acc;
}, {});

export default function GetMaskedPhoneNumber() {
  const [countryCode, setCountryCode] = useState('US');
  const [inpValue, setInpValue] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [maskingOptions, setMaskingOptions] = useState(INITIAL_STATE);
  const [withDialCode, setWithDialCode] = useState(true);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetMaskedPhoneNumber
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            📞🔒 The getMaskedPhoneNumber function is a versatile tool designed
            to handle phone number formatting and masking based on the specific
            requirements of different countries. This function is ideal for
            applications that require the display of partially hidden phone
            numbers for security purposes or privacy concerns. It supports a
            wide range of configurations, including options to mask portions of
            the phone number, specify the number of digits to mask, and choose
            whether to mask digits from the beginning or end of the number.
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
                  {getMaskedPhoneNumber({
                    countryCode,
                    phoneNumber: inpValue,
                    withDialCode,
                    maskingOptions,
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
          <Grid container rowSpacing={5} alignItems="center">
            <Grid item xs={isMobile ? 12 : 10}>
              <OutlinedInput
                value={inpValue}
                onChange={(ev) => {
                  setInpValue(ev.target.value);
                }}
                size="large"
                fullWidth
                placeholder="Enter value..."
              />
            </Grid>
            <Grid item xs={isMobile ? 12 : 10}>
              <CountryDropdown
                value={countryCode}
                onChange={(val) => setCountryCode(val)}
                selectStyle={{ mb: 0 }}
              />
            </Grid>
            <Grid item xs={isMobile ? 12 : 10}>
              <Typography variant="h5">With Dial Code ?</Typography>
              <Select
                size="small"
                value={withDialCode}
                onChange={(e) => setWithDialCode(e.target.value)}
                sx={{
                  height: '57px',
                  marginRight: 1,
                  width: '100%',
                }}
              >
                <MenuItem key={true} value={true}>
                  true
                </MenuItem>
                <MenuItem key={false} value={false}>
                  false
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={isMobile ? 12 : 10}>
              <PhoneMaskingOptions
                maskingOptions={maskingOptions}
                onChange={(val) => setMaskingOptions(val)}
              />
            </Grid>
          </Grid>
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
                  {getMaskedPhoneNumber({
                    countryCode,
                    phoneNumber: inpValue,
                    withDialCode,
                    maskingOptions,
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
