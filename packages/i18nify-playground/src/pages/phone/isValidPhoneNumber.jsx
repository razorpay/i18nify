import { useState } from 'react';
import { isValidPhoneNumber } from '@razorpay/i18nify-js/phoneNumber';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import PhoneNumberForm from 'src/sections/phoneNumber/phoneNumber-form';
// ----------------------------------------------------------------------

export default function IsValidPhoneNumberView() {
  const [inpValue, setInpValue] = useState('');
  const [dialCode, setDialCode] = useState('+91');
  const [countryCode, setCountryCode] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const phoneNumber = inpValue.replaceAll(' ').replaceAll('-');
  const isValid = isValidPhoneNumber(`${dialCode}${phoneNumber}`, countryCode);
  const errorMessage = isValid ? 'Valid phone number' : 'Invalid Phone Number';

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            IsValidPhoneNumber
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            📞 It’s like the phone number detective, using fancy patterns to
            check if a number is the real deal for a specific country code. So,
            it’s pretty simple: if it says true, your number’s good to go for
            that country; if it’s false, time to double-check those digits! 🕵️‍♂️🔍
          </Typography>
        </Grid>

        <Grid item xs={isMobile ? 12 : 7}>
          <PhoneNumberForm
            inpValue={inpValue}
            onInpChange={(val) => setInpValue(val)}
            dialCode={dialCode}
            onDialCodeChange={(val) => setDialCode(val)}
            countryCode={countryCode}
            onCountryCodeChange={(val) => setCountryCode(val)}
            errorMessage={errorMessage}
            isValid={isValid}
            utilName="isValidPhoneNumber"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
