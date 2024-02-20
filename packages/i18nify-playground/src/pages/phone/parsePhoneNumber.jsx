import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { parsePhoneNumber } from '@razorpay/i18nify-js/phoneNumber';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery } from '@mui/material';

import PhoneNumberForm from 'src/sections/phoneNumber/phoneNumber-form';

const CodeEditor = ({ value }) => {
  return (
    <Editor
      theme="vs-dark"
      defaultLanguage="json"
      value={value}
      options={{ minimap: { enabled: false } }}
    />
  );
};

// ----------------------------------------------------------------------

export default function ParsePhoneNumber() {
  const [inpValue, setInpValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialCode, setDialCode] = useState('+91');
  const code = inpValue > 5 ? parsePhoneNumber(`${dialCode}${inpValue}`) : {};
  const formattedCode = JSON.stringify(code, null, 2);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={isMobile ? 12 : 7}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            ParsePhoneNumber
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🕵️‍♂️📞 This clever function digs deep into a phone number, pulling out all the juicy
            details: country code, dial code, the number all dolled up, and even the format it
            follows. What’s cool? It hands you back an object filled with all these deets, making it
            a breeze to access everything about that phone number. It’s like having the ultimate
            phone number cheat sheet! 🌟
          </Typography>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <Grid sx={{ height: '200px' }} container alignItems="center" justifyContent="center">
              <Grid item sx={{ height: '200px', width: '100%', padding: '20px 0px' }}>
                <CodeEditor value={formattedCode} />
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid
          item
          xs={isMobile ? 12 : 7}
          sx={!isMobile && { 'border-right': '1px solid rgba(0,0,0,0.2)', pr: 2 }}
        >
          <PhoneNumberForm
            inpValue={inpValue}
            onInpChange={(val) => setInpValue(val)}
            countryCode={countryCode}
            dialCode={dialCode}
            onDialCodeChange={(val) => setDialCode(val)}
            onCountryCodeChange={(val) => setCountryCode(val)}
            utilName="parsePhoneNumber"
          />
        </Grid>

        {!isMobile && (
          <Grid item xs={5}>
            <Grid sx={{ height: '60vh' }} container alignItems="center" justifyContent="center">
              <Grid item sx={{ height: '100%', width: '100%', padding: '0px 20px' }}>
                <CodeEditor value={formattedCode} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
