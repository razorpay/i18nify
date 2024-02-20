import { useState, useEffect } from 'react';
import { getListOfAllFlags } from '@razorpay/i18nify-js';

import Container from '@mui/material/Container';
import { Grid, useTheme, Typography, useMediaQuery, Box } from '@mui/material';
import SVG from 'react-inlinesvg';

// ----------------------------------------------------------------------

export default function GetListOfAllFlags() {
  const [countryCodes, setCountryCodes] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setCountryCodes(getListOfAllFlags());
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item xs={12}>
          <Typography color="#4767FD" variant="h2" sx={{ mb: 2 }}>
            GetListOfAllFlags
          </Typography>

          <Typography variant="body1" sx={{ mb: 6 }}>
            🌍🚩 Imagine a virtual globe where you can spin and pick any country – that's what
            `getListOfAllFlags` brings to your codebase. This function maps out the whole world by
            returning an object with country codes as keys and their respective flag SVGs as values.
            It's like having a world atlas in your hands, but instead of pages, you get digital,
            vibrant flags of each nation. If any issue arises during this global flag gathering, the
            function won't just sweep it under the rug; it'll raise a flag (pun intended) to let you
            know.
          </Typography>
        </Grid>

        {isMobile && (
          <Grid item xs={12}>
            <Grid
              sx={{ height: '100px', backgroundColor: 'rgb(241, 243, 244)' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              {Object.entries(countryCodes).map(([countryCode, countrySvg]) => {
                return (
                  <>
                    <Box
                      sx={{
                        'margin-top': '10px',
                        display: 'flex',
                        'flex-direction': 'column',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'flex-wrap': 'wrap',
                      }}
                    >
                      <SVG src={countrySvg} width="100%" height="auto" title={countryCode} />
                      <Typography variant="body1">{countryCode}</Typography>
                    </Box>
                  </>
                );
              })}
            </Grid>
          </Grid>
        )}
        {!isMobile && (
          <Grid item xs={12}>
            <Grid
              sx={{ backgroundColor: 'rgb(241, 243, 244)' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              {Object.entries(countryCodes).map(([countryCode, countrySvg]) => {
                return (
                  <>
                    <Box
                      sx={{
                        margin: '10px',
                        display: 'flex',
                        'flex-direction': 'column',
                        'justify-content': 'center',
                        'align-items': 'center',
                      }}
                    >
                      <SVG src={countrySvg} width="60%" height="auto" title={countryCode} />
                      <Typography variant="body1">{countryCode}</Typography>
                    </Box>
                  </>
                );
              })}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
